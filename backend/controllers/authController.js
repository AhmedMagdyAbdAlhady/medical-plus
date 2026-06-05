const bcrypt = require("bcrypt");
const Joi = require("joi");
const { Customer } = require("../models/customers");

function validateLogin(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(1024).required(),
  });
  return schema.validate(body);
}

exports.login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const customer = await Customer.findOne({ email: req.body.email.toLowerCase() });
  if (!customer) {
    return res.status(400).send({ message: "Invalid email or password." });
  }

  const validPassword = await bcrypt.compare(req.body.password, customer.password);
  if (!validPassword) {
    return res.status(400).send({ message: "Invalid email or password." });
  }

  if (
    (customer.role === "seller" || customer.role === "customer") &&
    customer.isActive === false
  ) {
    return res.status(403).send({
      message: "Your account is not activated. Please contact an administrator.",
    });
  }

  const token = customer.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send({ token, customer: customer.toPublicJSON() });
};

exports.logout = async (req, res) => {
  res.header("x-auth-token", "").status(200).send({ message: "Logged out successfully." });
};