const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  purchasedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "refunded"],
    default: "active",
  },
  stripeSessionId: { type: String, unique: true, sparse: true },
});

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
exports.Enrollment = Enrollment;
