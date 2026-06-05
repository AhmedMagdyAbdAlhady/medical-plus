const { User } = require("../models/users");

async function requireActiveUser(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("role isActive");
    if (!user) {
      return res.status(401).send({ message: "User not found." });
    }

    if (
      (user.role === "teacher" || user.role === "student") &&
      user.isActive === false
    ) {
      return res.status(403).send({
        message: "Your account is deactivated. Contact an administrator.",
      });
    }

    req.currentUser = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireActiveUser;
