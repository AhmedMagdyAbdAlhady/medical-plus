const mongoose = require("mongoose");
const Joi = require("joi");

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  email: String,
  dateCreated: { type: Date, default: Date.now },
});
const Author = mongoose.model("Author", authorSchema);

function handleAuthorValidation(authors) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    bio: Joi.string().min(15).max(1024).required(),
    email:  Joi.string().email().required(),
  });

  return schema.validate(authors);
}
exports.authorSchema = authorSchema;
exports.Author = Author;
exports.handleAuthorValidation = handleAuthorValidation;

