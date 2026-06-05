const { Course, handleCourseValidation } = require("../models/courses");
const { Enrollment } = require("../models/enrollments");
const {
  uploadsPath,
  sliderPathsFromFiles,
  parseTags,
} = require("../helpers/courseHelpers");
const { canAccessCourseContent, canModifyCourse } = require("../helpers/courseAccess");

function buildQuery(req) {
  const query = {};
  if (req.user?.role === "teacher" && req.query.mine === "true") {
    query.teacher = req.user._id;
  }
  if (req.user?.role === "admin" && req.query.all === "true") {
    return query;
  }
  if (!req.user || req.user.role === "student" || req.query.published === "true") {
    query.isPublished = true;
  }
  return query;
}

exports.getAll = async (req, res) => {
  const query = buildQuery(req);

  const courses = await Course.find(query)
    .populate("author", "name bio email")
    .populate("teacher", "name email")
    .sort("title");
  res.status(200).send(courses);
};

exports.getMine = async (req, res) => {
  const courses = await Course.find({ teacher: req.user._id })
    .populate("author", "name bio email")
    .sort("-dateCreated");
  res.status(200).send(courses);
};

exports.getById = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("author", "name bio email")
    .populate("teacher", "name email");

  if (!course) {
    return res.status(404).send({ message: "Course not found." });
  }

  if (!course.isPublished) {
    const canView =
      req.user &&
      (req.user.role === "admin" || canModifyCourse(req.user, course));
    if (!canView) {
      return res.status(404).send({ message: "Course not found." });
    }
  }

  res.status(200).send(course);
};

exports.getLearn = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("author", "name bio email")
    .populate("teacher", "name email");

  if (!course) {
    return res.status(404).send({ message: "Course not found." });
  }

  const allowed = await canAccessCourseContent(req.user, course);
  if (!allowed) {
    return res.status(403).send({ message: "Enrollment required to access this course." });
  }

  res.status(200).send(course);
};

function buildCourseFromBody(req) {
  const files = req.files || {};
  const coverFile = files.courseCover && files.courseCover[0];
  const sliderFiles = files.courseSliderImages || [];

  const courseCover = coverFile
    ? uploadsPath(coverFile.filename)
    : req.body.courseCover;

  const courseSliderImages =
    sliderFiles.length > 0
      ? sliderPathsFromFiles(sliderFiles)
      : req.body.courseSliderImages;

  return {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount || 0,
    courseCover,
    courseSliderImages,
    author: req.body.author,
    tags: parseTags(req.body),
    isPublished: req.body.isPublished === true || req.body.isPublished === "true",
    category: req.body.category,
    teacher: req.user.role === "teacher" ? req.user._id : req.body.teacher || req.user._id,
  };
}

exports.create = async (req, res) => {
  req.body.tags = parseTags(req.body);
  const { error } = handleCourseValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const payload = buildCourseFromBody(req);
  if (req.user.role === "teacher") {
    payload.teacher = req.user._id;
  } else if (req.user.role === "admin" && req.body.teacher) {
    payload.teacher = req.body.teacher;
  }

  const course = new Course(payload);
  const result = await course.save();
  const populated = await Course.findById(result._id)
    .populate("author", "name bio email")
    .populate("teacher", "name email");
  res.status(201).send(populated);
};

exports.update = async (req, res) => {
  req.body.tags = parseTags(req.body);
  const { error } = handleCourseValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const existing = await Course.findById(req.params.id);
  if (!existing) {
    return res.status(404).send({ message: "Course not found." });
  }

  if (req.user.role !== "admin" && !canModifyCourse(req.user, existing)) {
    return res.status(403).send({ message: "Access denied." });
  }

  const payload = buildCourseFromBody(req);
  if (req.user.role === "teacher") {
    payload.teacher = existing.teacher || req.user._id;
  }

  const course = await Course.findByIdAndUpdate(req.params.id, payload, {
    new: true,
  })
    .populate("author", "name bio email")
    .populate("teacher", "name email");

  res.status(200).send(course);
};

exports.setPublished = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).send({ message: "Course not found." });
  }

  if (typeof req.body.isPublished !== "boolean") {
    return res.status(400).send({ message: "isPublished must be a boolean." });
  }

  course.isPublished = req.body.isPublished;
  await course.save();

  const populated = await Course.findById(course._id)
    .populate("author", "name bio email")
    .populate("teacher", "name email");

  res.send(populated);
};

exports.delete = async (req, res) => {
  const existing = await Course.findById(req.params.id);
  if (!existing) {
    return res.status(404).send({ message: "Course not found." });
  }

  if (req.user.role === "teacher" && !canModifyCourse(req.user, existing)) {
    return res.status(403).send({ message: "Access denied." });
  }

  const course = await Course.findByIdAndDelete(req.params.id);
  await Enrollment.deleteMany({ course: course._id });
  res.status(200).send(course);
};
