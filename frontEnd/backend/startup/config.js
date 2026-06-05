const config = require("config");
require("dotenv").config();

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
  }
};
