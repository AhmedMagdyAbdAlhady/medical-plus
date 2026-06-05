const path = require("path");

module.exports = function (app) {
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
};
