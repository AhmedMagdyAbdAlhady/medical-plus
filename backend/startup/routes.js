const express = require("express");
const helmet = require("helmet");
const path = require("path");

// 1. Core E-commerce Routers Integration
const products = require("../router/products");
const sellers = require("../router/authors"); // Refactored from authors to marketplace sellers
const customers = require("../router/customer"); // Reconfigured for buyer management tracking
const auth = require("../router/auth");
const payments = require("../router/payments");
const settings = require("../router/settings");
const stats = require("../router/stats");

// 2. Controller Imports for Stripe Streaming Webhook Listeners
const paymentsController = require("../controllers/paymentsController");
const error = require("../middleware/error");
const { apiLimiter, authLimiter } = require("../middleware/rateLimiter");

module.exports = function (app) {
  // Enforce secure HTTP response headers across decentralized storefront pipelines
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  // Raw body parser integration explicitly configured for verified Stripe event signatures
  app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    paymentsController.handleCheckoutSessionCompleted, // Updated method reference to match payments controller changes
  );

  app.use(express.json());

  // Root entrypoint sanity check endpoint configuration layout
  app.get("/", (req, res) => {
    console.log("API is running...");
    res.status(200).json({ status: "OK" });
  });

  // Expose local file system buffer uploads storage safely for product media assets 
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  // Mount targeted dDoS protection rate-limiting middlewares
  app.use("/api/auth/", authLimiter);
  app.use("/api", apiLimiter);

  // 3. Mount E-commerce Domain Specific Router Mappings
  app.use("/api/products", products);
  app.use("/api/sellers", sellers); // Mounted /api/sellers instead of /api/authors
  app.use("/api/customers", customers);
  app.use("/api/auth", auth);
  app.use("/api/payments", payments);
  app.use("/api/settings", settings);
  app.use("/api/stats", stats);

  // Global global unhandled error routing boundary filter pipeline catcher
  app.use(error);
};
