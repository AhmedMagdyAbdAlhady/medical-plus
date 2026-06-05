const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true,
    min: 0,
    set: (v) => Math.round(v * 100) / 100,
    get: (v) => Math.round(v * 100) / 100,
  },
  currency: { type: String, default: "usd", lowercase: true },
  status: {
    type: String,
    enum: ["completed", "refunded", "free"],
    default: "completed",
  },
  stripeSessionId: { type: String, sparse: true },
  stripePaymentIntentId: { type: String, sparse: true },
  paidAt: { type: Date, default: Date.now },
});

paymentSchema.index({ student: 1, course: 1 });
paymentSchema.index({ stripeSessionId: 1 }, { unique: true, sparse: true });

const Payment = mongoose.model("Payment", paymentSchema);
exports.Payment = Payment;
