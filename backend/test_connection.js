import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("Attempting to connect to MongoDB Atlas...");
console.log("URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB Atlas successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR: Failed to connect to MongoDB Atlas:", err.message);
    process.exit(1);
  });
