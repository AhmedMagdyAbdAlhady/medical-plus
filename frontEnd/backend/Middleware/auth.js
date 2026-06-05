const jwt = require("jsonwebtoken");
const config = require("config");
const requireActiveUser = require("./requireActiveUser");

async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    await requireActiveUser(req, res, next);
  } catch (err) {
    res.status(400).send({ message: "Invalid token." });
  }
}

module.exports = auth;
