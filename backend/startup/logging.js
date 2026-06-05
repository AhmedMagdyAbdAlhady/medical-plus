const path = require("path");
const winston = require("winston");

module.exports = function () {
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );

  winston.add(
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "logfile.log"),
    }),
  );

  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
  });

  process.on("unhandledRejection", (ex) => {
    winston.error(ex?.message || ex, ex);
  });
};
