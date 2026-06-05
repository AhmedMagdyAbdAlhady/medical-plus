const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const ROLES = ["admin", "seller", "customer"];

const customerSchema = new mongoose.Schema({
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
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  dataCreated: {
    type: Date,
    default: Date.now,
  },
});

function handlecustomerValidation(body) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(1024).required(),
    role: Joi.string()
      .valid(...ROLES)
      .default("customer"),
    isActive: Joi.boolean(),
  });
  return schema.validate(body);
}

customerSchema.methods.generateAuthToken = function () {
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

customerSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    dataCreated: this.dataCreated,
  };
};

const Customer = mongoose.model("Customer", customerSchema);
exports.ROLES = ROLES;
exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.customer = Customer;
exports.handlecustomerValidation = handlecustomerValidation;