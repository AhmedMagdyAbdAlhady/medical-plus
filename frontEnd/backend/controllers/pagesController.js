const { Course } = require("../models/courses");
const { Author } = require("../models/authors");

const authorFields = "name bio email";

exports.home = (req, res) => {
  res.render("home", { title: "Home" });
};

exports.courses = async (req, res) => {
  const courses = await Course.find()
    .populate("author", authorFields)
    .sort("title");

  res.render("courses", { title: "Courses", courses });
};

exports.authors = async (req, res) => {
  const authors = await Author.find().sort("name");
  res.render("authors", { title: "Authors", authors });
};
