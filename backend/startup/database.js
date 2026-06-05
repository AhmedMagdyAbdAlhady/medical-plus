const mongoose = require("mongoose");
const winston = require("winston");

const mongoUri = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
module.exports = function () {
mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => winston.info("connected to MongoDB"))
  .catch((err) => console.error("could not connect to MongoDB", err));
};