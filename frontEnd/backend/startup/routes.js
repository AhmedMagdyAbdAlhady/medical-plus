const express = require("express");
const helmet = require("helmet");
const path = require("path");
const courses = require("../router/courses");
const authors = require("../router/authors");
const users = require("../router/users");
const auth = require("../router/auth");
const payments = require("../router/payments");
const settings = require("../router/settings");
const stats = require("../router/stats");
const paymentsController = require("../controllers/paymentsController");
const error = require("../middleware/error");
const { apiLimiter, authLimiter } = require("../middleware/rateLimiter");

module.exports = function (app) {
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    paymentsController.webhook,
  );

  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  app.use("/api/auth/", authLimiter);
  app.use("/api", apiLimiter);

  app.use("/api/courses", courses);
  app.use("/api/authors", authors);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/payments", payments);
  app.use("/api/settings", settings);
  app.use("/api/stats", stats);

  app.use(error);
};
