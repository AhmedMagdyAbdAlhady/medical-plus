const { User } = require("../models/users");
const { Course } = require("../models/courses");
const { Enrollment } = require("../models/enrollments");
const { Payment } = require("../models/payments");

function lastMonths(count) {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    months.push({
      label: d.toLocaleString("en", { month: "short", year: "2-digit" }),
      start: d,
      end,
    });
  }
  return months;
}

function countInRange(items, dateField, start, end) {
  return items.filter((item) => {
    const d = item[dateField];
    return d && d >= start && d <= end;
  }).length;
}

function groupByField(items, field, labels) {
  return labels.map((name) => ({
    name,
    value: items.filter((item) => item[field] === name).length,
  }));
}

exports.admin = async (req, res) => {
  const [users, courses, enrollments, payments] = await Promise.all([
    User.find().select("role"),
    Course.find().select("category isPublished"),
    Enrollment.find({ status: "active" }).select("purchasedAt"),
    Payment.find().select("amount status paidAt"),
  ]);

  const totalPayments = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const months = lastMonths(6);
  const enrollmentsByMonth = months.map((m) => ({
    name: m.label,
    value: countInRange(enrollments, "purchasedAt", m.start, m.end),
  }));

  const paymentsByMonth = months.map((m) => ({
    name: m.label,
    value: Math.round(
      payments
        .filter(
          (p) =>
            p.status === "completed" &&
            p.paidAt >= m.start &&
            p.paidAt <= m.end,
        )
        .reduce((sum, p) => sum + (p.amount || 0), 0) * 100,
    ) / 100,
  }));

  res.send({
    totals: {
      users: users.length,
      courses: courses.length,
      published: courses.filter((c) => c.isPublished).length,
      enrollments: enrollments.length,
      totalPayments: Math.round(totalPayments * 100) / 100,
      paymentCount: payments.length,
    },
    paymentsByMonth,
    usersByRole: groupByField(users, "role", ["admin", "teacher", "student"]),
    coursesByCategory: groupByField(courses, "category", ["medicine", "surgery", "pharmacy", "nursing", "dentistry"]),
    publishedStatus: [
      { name: "Published", value: courses.filter((c) => c.isPublished).length },
      { name: "Draft", value: courses.filter((c) => !c.isPublished).length },
    ],
    enrollmentsByMonth,
  });
};

exports.teacher = async (req, res) => {
  const courses = await Course.find({ teacher: req.user._id }).select(
    "category isPublished title",
  );
  const courseIds = courses.map((c) => c._id);
  const enrollments = await Enrollment.find({
    course: { $in: courseIds },
    status: "active",
  }).select("purchasedAt course");

  const months = lastMonths(6);
  const enrollmentsByMonth = months.map((m) => ({
    name: m.label,
    value: countInRange(enrollments, "purchasedAt", m.start, m.end),
  }));

  const topCourses = await Enrollment.aggregate([
    { $match: { course: { $in: courseIds }, status: "active" } },
    { $group: { _id: "$course", value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $limit: 5 },
  ]);

  const courseMap = Object.fromEntries(courses.map((c) => [c._id.toString(), c.title]));
  const enrollmentsByCourse = topCourses.map((row) => ({
    name: courseMap[row._id.toString()] || "Course",
    value: row.value,
  }));

  res.send({
    totals: {
      courses: courses.length,
      published: courses.filter((c) => c.isPublished).length,
      enrollments: enrollments.length,
    },
    coursesByCategory: groupByField(courses, "category", ["medicine", "surgery", "pharmacy", "nursing", "dentistry"]),
    publishedStatus: [
      { name: "Published", value: courses.filter((c) => c.isPublished).length },
      { name: "Draft", value: courses.filter((c) => !c.isPublished).length },
    ],
    enrollmentsByMonth,
    enrollmentsByCourse,
  });
};

exports.student = async (req, res) => {
  const enrollments = await Enrollment.find({
    student: req.user._id,
    status: "active",
  })
    .populate("course", "category title")
    .select("purchasedAt course");

  const months = lastMonths(6);
  const enrollmentsByMonth = months.map((m) => ({
    name: m.label,
    value: countInRange(enrollments, "purchasedAt", m.start, m.end),
  }));

  const categories = ["medicine", "surgery", "pharmacy", "nursing", "dentistry"];
  const coursesByCategory = categories.map((name) => ({
    name,
    value: enrollments.filter(
      (e) => e.course && e.course.category === name,
    ).length,
  }));

  res.send({
    totals: {
      enrolled: enrollments.length,
    },
    enrollmentsByMonth,
    coursesByCategory,
  });
};
