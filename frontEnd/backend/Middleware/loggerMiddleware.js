function logMsg(req, res, next) {
  console.log("Custom Middleware: Logging Request Details loggerMiddleware");
  next();
}

module.exports = logMsg;