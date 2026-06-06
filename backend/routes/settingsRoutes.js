import express from "express";
import Settings from "../models/Settings.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get pharmacy settings
// @route   GET /api/settings
// @access  Public
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default if none exists
      settings = new Settings({});
      await settings.save();
    }
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Update pharmacy settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put("/", protect, adminOnly, async (req, res) => {
  const { name, address, phone, deliveryFee, isOpen } = req.body;

  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (name !== undefined) settings.name = name;
    if (address !== undefined) settings.address = address;
    if (phone !== undefined) settings.phone = phone;
    if (deliveryFee !== undefined) settings.deliveryFee = deliveryFee;
    if (isOpen !== undefined) settings.isOpen = isOpen;

    const updatedSettings = await settings.save();
    return res.json(updatedSettings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
