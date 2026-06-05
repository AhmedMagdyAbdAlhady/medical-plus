const { isConnected } = require("../startup/database");

module.exports = function dbReady(req, res, next) {
  if (!isConnected()) {
    return res.status(503).send({
      message:
        "Database is not connected. Check MONGODB_URI in backend/.env and MongoDB/Atlas network access.",
    });
  }
  next();
};
