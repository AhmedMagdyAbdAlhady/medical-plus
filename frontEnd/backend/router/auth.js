const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const auth = require("../middleware/auth");
const authController = require("../controllers/authController");
const asyncHandler = require("express-async-handler");
const router = express.Router();

router.post("/login", authController.login);

// logout route to invalidate the token (optional, as JWT is stateless and cannot be invalidated on the server side)
router.post("/logout", auth, authController.logout);
module.exports = router;
