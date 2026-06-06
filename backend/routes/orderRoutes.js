import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", protect, async (req, res) => {
  const { items, shippingAddress, prescriptionImage, totalAmount } = req.body;

  if ((!items || items.length === 0) && !prescriptionImage) {
    return res.status(400).json({ message: "No order items or prescription image" });
  }

  try {
    // Map product IDs to MongoDB ObjectIds if they are numeric
    const Product = (await import("../models/Product.js")).default;
    const mappedItems = [];
    
    if (items && items.length > 0) {
      for (const item of items) {
        let productObjectId = item.product;
        
        // If product ID is a number, find the corresponding product in DB to get its ObjectId
        if (!isNaN(Number(productObjectId)) && String(productObjectId).length < 10) {
          const dbProduct = await Product.findOne({ id: Number(productObjectId) });
          if (dbProduct) {
            productObjectId = dbProduct._id;
          } else {
            return res.status(400).json({ message: `Product with ID ${productObjectId} not found` });
          }
        }
        
        mappedItems.push({
          product: productObjectId,
          qty: item.qty,
          price: item.price
        });
      }
    }

    const order = new Order({
      user: req.user._id,
      items: mappedItems,
      shippingAddress,
      prescriptionImage,
      totalAmount: totalAmount || 0,
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort("-createdAt");
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all
// @access  Private/Admin
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product")
      .sort("-createdAt");
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const newStatus = req.body.status;
      const previousStatus = order.status;

      if (newStatus && newStatus !== previousStatus) {
        // If status changes to Delivered and wasn't Delivered before, deduct stock
        if (newStatus === "Delivered" && previousStatus !== "Delivered") {
          const Product = (await import("../models/Product.js")).default;
          for (const item of order.items) {
            if (item.product) {
              const product = await Product.findById(item.product);
              if (product) {
                product.stock = Math.max(0, product.stock - item.qty);
                await product.save();
              }
            }
          }
        }
        order.status = newStatus;
      }

      if (req.body.totalAmount !== undefined) {
        order.totalAmount = req.body.totalAmount;
      }

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      return res.json({ message: "Order removed successfully" });
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
