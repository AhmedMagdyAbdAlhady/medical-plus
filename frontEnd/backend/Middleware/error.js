const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  const status = err.statusCode || 500;
  res.status(status).send({ message: err.message || "Something went wrong." });
};
