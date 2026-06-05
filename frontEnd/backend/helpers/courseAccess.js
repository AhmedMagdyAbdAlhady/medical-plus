const { Enrollment } = require("../models/enrollments");

async function canAccessCourseContent(user, course) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (
    user.role === "teacher" &&
    course.teacher &&
    course.teacher.toString() === user._id.toString()
  ) {
    return true;
  }
  if (user.role === "student") {
    const enrollment = await Enrollment.findOne({
      student: user._id,
      course: course._id,
      status: "active",
    });
    return !!enrollment;
  }
  return false;
}

function canModifyCourse(user, course) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (
    user.role === "teacher" &&
    course.teacher &&
    course.teacher.toString() === user._id.toString()
  ) {
    return true;
  }
  return false;
}

module.exports = { canAccessCourseContent, canModifyCourse };
