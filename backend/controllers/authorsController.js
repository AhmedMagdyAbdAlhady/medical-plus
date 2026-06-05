const { Author, handleAuthorValidation } = require("../models/authors");

exports.getAll = async (req, res) => {
  const authors = await Author.find().sort("name");
  res.status(200).send(authors);
};

exports.getById = async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) {
    return res.status(404).send({ message: "Author not found." });
  }
  res.status(200).send(author);
};

exports.create = async (req, res) => {
  const { error } = handleAuthorValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const author = new Author({
    name: req.body.name,
    bio: req.body.bio,
    email: req.body.email,
  });

  const result = await author.save();
  res.status(201).send(result);
};

exports.update = async (req, res) => {
  const { error } = handleAuthorValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      bio: req.body.bio,
      email: req.body.email,
    },
    { new: true },
  );

  if (!author) {
    return res.status(404).send({ message: "Author not found." });
  }
  res.status(200).send(author);
};

exports.delete = async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author) {
    return res.status(404).send({ message: "Author not found." });
  }
  res.status(200).send(author);
};
