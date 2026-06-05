const _ = require("lodash");
const bcrypt = require("bcrypt");
const { customer, handlecustomerValidation, ROLES } = require("../models/customers");

exports.getAll = async (req, res) => {
  const customers = await customer.find().sort("name").select("-password");
  res.send(customers);
};

exports.getMe = async (req, res) => {
  const foundCustomer = await customer.findById(req.customer._id).select("-password");
  if (!foundCustomer) return res.status(404).send({ message: "Customer not found." });
  res.send(foundCustomer);
};

exports.create = async (req, res) => {
  const { error } = handlecustomerValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const existing = await customer.findOne({ email: req.body.email.toLowerCase() });
  if (existing) {
    return res.status(400).send({ message: "Customer already exists." });
  }

  const newCustomer = new customer({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    role: "customer",
    isActive: false,
  });

  const salt = await bcrypt.genSalt(10);
  newCustomer.password = await bcrypt.hash(newCustomer.password, salt);
  await newCustomer.save();

  res.status(201).send({
    message: "Account created. An administrator must activate your account before you can sign in.",
    customer: newCustomer.toPublicJSON(),
    requiresActivation: true,
  });
};

exports.createByAdmin = async (req, res) => {
  const { error } = handlecustomerValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  if (!ROLES.includes(req.body.role) || req.body.role === "customer") {
    return res.status(400).send({ message: "Role must be admin or seller." });
  }

  const existing = await customer.findOne({ email: req.body.email.toLowerCase() });
  if (existing) {
    return res.status(400).send({ message: "Customer already exists." });
  }

  const newCustomer = new customer({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    role: req.body.role,
    isActive: req.body.isActive !== false,
  });

  const salt = await bcrypt.genSalt(10);
  newCustomer.password = await bcrypt.hash(newCustomer.password, salt);
  await newCustomer.save();

  res.status(201).send(newCustomer.toPublicJSON());
};

exports.updateMe = async (req, res) => {
  const foundCustomer = await customer.findById(req.customer._id);
  if (!foundCustomer) return res.status(404).send({ message: "Customer not found." });

  if (req.body.name) foundCustomer.name = req.body.name;
  if (req.body.email) foundCustomer.email = req.body.email.toLowerCase();

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    foundCustomer.password = await bcrypt.hash(req.body.password, salt);
  }

  await foundCustomer.save();
  res.send(foundCustomer.toPublicJSON());
};

exports.updateById = async (req, res) => {
  const foundCustomer = await customer.findById(req.params.id);
  if (!foundCustomer) return res.status(404).send({ message: "Customer not found." });

  if (req.body.name) foundCustomer.name = req.body.name;
  if (req.body.email) foundCustomer.email = req.body.email.toLowerCase();
  if (req.body.role && ROLES.includes(req.body.role)) foundCustomer.role = req.body.role;

  if (typeof req.body.isActive === "boolean") {
    if (foundCustomer.role === "admin") {
      return res.status(400).send({ message: "Cannot change activation status of admin accounts." });
    }
    foundCustomer.isActive = req.body.isActive;
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    foundCustomer.password = await bcrypt.hash(req.body.password, salt);
  }

  await foundCustomer.save();
  res.send(foundCustomer.toPublicJSON());
};

exports.setActive = async (req, res) => {
  const foundCustomer = await customer.findById(req.params.id);
  if (!foundCustomer) return res.status(404).send({ message: "Customer not found." });

  if (foundCustomer.role === "admin") {
    return res.status(400).send({ message: "Cannot deactivate admin accounts." });
  }

  if (typeof req.body.isActive !== "boolean") {
    return res.status(400).send({ message: "isActive must be a boolean." });
  }

  foundCustomer.isActive = req.body.isActive;
  await foundCustomer.save();
  res.send(foundCustomer.toPublicJSON());
};

exports.remove = async (req, res) => {
  const foundCustomer = await customer.findByIdAndDelete(req.params.id);
  if (!foundCustomer) return res.status(404).send({ message: "Customer not found." });
  res.send({ message: "Customer deleted.", customer: foundCustomer.toPublicJSON() });
};