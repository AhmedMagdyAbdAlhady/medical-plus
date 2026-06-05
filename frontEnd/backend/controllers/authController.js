const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/users");

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

  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) {
    return res.status(400).send({ message: "Invalid email or password." });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send({ message: "Invalid email or password." });
  }

  if (
    (user.role === "teacher" || user.role === "student") &&
    user.isActive === false
  ) {
    return res.status(403).send({
      message: "Your account is not activated. Please contact an administrator.",
    });
  }

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send({ token, user: user.toPublicJSON() });
};

exports.logout = async (req, res) => {
  res.header("x-auth-token", "").status(200).send({ message: "Logged out successfully." });
};
