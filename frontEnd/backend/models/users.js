const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const ROLES = ["admin", "teacher", "student"];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: ROLES,
    default: "student",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dataCreated: {
    type: Date,
    default: Date.now,
  },
});

function handleUserValidation(user, options = {}) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(1024).when("$isUpdate", {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    role: Joi.string().valid(...ROLES),
  });
  return schema.validate(user, { context: options });
}

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "7d" },
  );
  return token;
};

userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    dataCreated: this.dataCreated,
  };
};

const User = mongoose.model("User", userSchema);
exports.ROLES = ROLES;
exports.userSchema = userSchema;
exports.User = User;
exports.handleUserValidation = handleUserValidation;
