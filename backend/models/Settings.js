import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "SereneMeds Central Pharmacy",
    },
    address: {
      type: String,
      default: "12 El-Gish Street, Assiut, Egypt",
    },
    phone: {
      type: String,
      default: "021 344 1122",
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 25,
      min: [0, "Delivery fee cannot be negative"],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
