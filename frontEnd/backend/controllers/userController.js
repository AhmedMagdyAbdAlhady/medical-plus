const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, handleUserValidation, ROLES } = require("../models/users");

exports.getAll = async (req, res) => {
  const users = await User.find().sort("name").select("-password");
  res.send(users);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).send({ message: "User not found." });
  res.send(user);
};

exports.create = async (req, res) => {
  const { error } = handleUserValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const existing = await User.findOne({ email: req.body.email.toLowerCase() });
  if (existing) {
    return res.status(400).send({ message: "User already exists." });
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    role: "student",
    isActive: false,
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  await newUser.save();

  res.status(201).send({
    message: "Account created. An administrator must activate your account before you can sign in.",
    user: newUser.toPublicJSON(),
    requiresActivation: true,
  });
};

exports.createByAdmin = async (req, res) => {
  const { error } = handleUserValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  if (!ROLES.includes(req.body.role) || req.body.role === "student") {
    return res.status(400).send({ message: "Role must be admin or teacher." });
  }

  const existing = await User.findOne({ email: req.body.email.toLowerCase() });
  if (existing) {
    return res.status(400).send({ message: "User already exists." });
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    role: req.body.role,
    isActive: req.body.isActive !== false,
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  await newUser.save();

  res.status(201).send(newUser.toPublicJSON());
};

exports.updateMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send({ message: "User not found." });

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email.toLowerCase();

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  await user.save();
  res.send(user.toPublicJSON());
};

exports.updateById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send({ message: "User not found." });

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email.toLowerCase();
  if (req.body.role && ROLES.includes(req.body.role)) user.role = req.body.role;

  if (typeof req.body.isActive === "boolean") {
    if (user.role === "admin") {
      return res.status(400).send({ message: "Cannot change activation status of admin accounts." });
    }
    user.isActive = req.body.isActive;
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  await user.save();
  res.send(user.toPublicJSON());
};

exports.setActive = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send({ message: "User not found." });

  if (user.role === "admin") {
    return res.status(400).send({ message: "Cannot deactivate admin accounts." });
  }

  if (typeof req.body.isActive !== "boolean") {
    return res.status(400).send({ message: "isActive must be a boolean." });
  }

  user.isActive = req.body.isActive;
  await user.save();
  res.send(user.toPublicJSON());
};

exports.remove = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send({ message: "User not found." });
  res.send({ message: "User deleted.", user: user.toPublicJSON() });
};
