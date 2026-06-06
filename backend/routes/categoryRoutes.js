import express from "express";
import Category from "../models/Category.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
router.post("/", protect, adminOnly, async (req, res) => {
  const { name, description, icon, subCategories } = req.body;

  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const maxCat = await Category.findOne().sort("-id");
    const newId = maxCat ? maxCat.id + 1 : 1;

    const category = new Category({
      id: newId,
      name,
      description,
      icon,
      subCategories: subCategories || [],
    });

    const createdCategory = await category.save();
    return res.status(201).json(createdCategory);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
