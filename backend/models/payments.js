const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
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
  // تم دمج الفهرس الفريد هنا مباشرة لحل المشكلة
  stripeSessionId: { type: String, unique: true, sparse: true },
  stripePaymentIntentId: { type: String, sparse: true },
  paidAt: { type: Date, default: Date.now },
});

// السجل الهيكلي لتسريع عمليات البحث الخاصة بالعميل
paymentSchema.index({ customer: 1, product: 1 });

// تم حذف السطر المكرر الخاص بـ stripeSessionId من هنا لمنع ظهور التحذير

const Payment = mongoose.model("Payment", paymentSchema);
exports.Payment = Payment;
