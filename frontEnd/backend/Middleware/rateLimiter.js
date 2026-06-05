const { rateLimit } = require("express-rate-limit");

/** Set RATE_LIMIT_ENABLED=true in .env to turn limits back on. */
const enabled = process.env.RATE_LIMIT_ENABLED === "true";

const noop = (_req, _res, next) => next();

const windowMs = 15 * 60 * 1000;

const apiLimiter = enabled
  ? rateLimit({
      windowMs,
      max: Number(process.env.RATE_LIMIT_API_MAX) || 100,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { message: "Too many requests from this IP, please try again later." },
    })
  : noop;

const authLimiter = enabled
  ? rateLimit({
      windowMs,
      max: Number(process.env.RATE_LIMIT_AUTH_MAX) || 20,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { message: "Too many authentication attempts, please try again later." },
    })
  : noop;

module.exports = { apiLimiter, authLimiter, enabled };
