import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import connectDB from "./config/db.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

// Load Environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS for frontend requests
app.use(cors());

// Body Parser Middleware
app.use(express.json());

// Ensure Uploads folder exists for prescription images
const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded prescription files statically
app.use("/uploads", express.static(uploadsDir));

// Mount REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingsRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("Medical Plus API is running successfully...");
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
