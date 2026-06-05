const { Product } = require("../models/product");
const { customer } = require("../models/customers");

const sellerFields = "name email storeName";

// 1. Render the main e-commerce landing page
exports.home = (req, res) => {
  res.render("home", { title: "Home" });
};

// 2. Fetch and render the entire public medicine and supplements product catalog
exports.products = async (req, res) => {
  const products = await Product.find({ isPublished: true })
    .populate("seller", sellerFields)
    .sort("name");

  res.render("products", { title: "Products Shop", products });
};

// 3. Fetch and render registered marketplace merchant store profiles
exports.sellers = async (req, res) => {
  const sellers = await customer.find({ role: "seller" }).sort("name");
  res.render("sellers", { title: "Our Trusted Sellers", sellers });
};