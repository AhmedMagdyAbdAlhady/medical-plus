const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer ",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  purchasedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ["pending", "completed", "refunded", "cancelled"],
    default: "pending",
  },
  stripeSessionId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
});

// Ensures a unique purchase transaction entry history context for a specific customer  and product pairing
orderSchema.index({ customer: 1, product: 1 }, { unique: true });

const Order = mongoose.model("Order", orderSchema);
exports.Order = Order;
