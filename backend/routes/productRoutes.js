import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Fetch all products with optional filters
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  const { category, search, isPopular, isBestForLess } = req.query;
  let query = {};

  if (category) {
    // Case-insensitive match
    query.category = { $regex: new RegExp("^" + category.trim() + "$", "i") };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (isPopular !== undefined) {
    query.isPopular = isPopular === "true";
  }

  if (isBestForLess !== undefined) {
    query.isBestForLess = isBestForLess === "true";
  }

  try {
    const products = await Product.find(query);
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product by numeric id or ObjectId
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  const idParam = req.params.id;

  try {
    let product;
    if (isNaN(Number(idParam)) || idParam.length > 10) {
      // If it looks like a MongoDB ObjectId
      product = await Product.findById(idParam);
    } else {
      // If it's a numeric ID (frontend compatibility)
      product = await Product.findOne({ id: Number(idParam) });
    }

    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    // Generate new numeric ID for frontend compatibility
    const maxProduct = await Product.findOne().sort("-id");
    const newId = maxProduct ? maxProduct.id + 1 : 1;

    const {
      name,
      brand,
      category,
      subCategory,
      price,
      image,
      generics,
      usedFor,
      howItWorks,
      precautions,
      sideEffects,
      description,
      isBestForLess,
      isPopular,
      stock,
    } = req.body;

    const product = new Product({
      id: newId,
      name,
      brand,
      category,
      subCategory,
      price: Number(price),
      image: image || "/images/product1.webp",
      generics,
      usedFor,
      howItWorks,
      precautions,
      sideEffects,
      description,
      isBestForLess: isBestForLess === true || isBestForLess === "true",
      isPopular: isPopular === true || isPopular === "true",
      stock: stock ? Number(stock) : 50,
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", protect, adminOnly, async (req, res) => {
  const idParam = req.params.id;

  try {
    let product;
    if (isNaN(Number(idParam)) || idParam.length > 10) {
      product = await Product.findById(idParam);
    } else {
      product = await Product.findOne({ id: Number(idParam) });
    }

    if (product) {
      product.name = req.body.name || product.name;
      product.brand = req.body.brand || product.brand;
      product.category = req.body.category || product.category;
      product.subCategory = req.body.subCategory || product.subCategory;
      product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
      product.image = req.body.image || product.image;
      product.generics = req.body.generics || product.generics;
      product.usedFor = req.body.usedFor || product.usedFor;
      product.howItWorks = req.body.howItWorks || product.howItWorks;
      product.precautions = req.body.precautions || product.precautions;
      product.sideEffects = req.body.sideEffects || product.sideEffects;
      product.description = req.body.description || product.description;
      product.isBestForLess = req.body.isBestForLess !== undefined ? (req.body.isBestForLess === true || req.body.isBestForLess === "true") : product.isBestForLess;
      product.isPopular = req.body.isPopular !== undefined ? (req.body.isPopular === true || req.body.isPopular === "true") : product.isPopular;
      product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;

      const updatedProduct = await product.save();
      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const idParam = req.params.id;

  try {
    let result;
    if (isNaN(Number(idParam)) || idParam.length > 10) {
      result = await Product.deleteOne({ _id: idParam });
    } else {
      result = await Product.deleteOne({ id: Number(idParam) });
    }

    if (result.deletedCount > 0) {
      return res.json({ message: "Product removed successfully" });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
