const { Product, handleProductValidation } = require("../models/product");
const { Order } = require("../models/orders"); 
const {
  uploadsPath,
  sliderPathsFromFiles,
  parseTags,
} = require("../helpers/productHelpers"); 
const { canAccessProductMedia, canModifyProduct } = require("../helpers/productAccess");

// Build query based on customer  role and permissions
function buildQuery(req) {
  const query = {};
  
  // If customer  is a seller and requests their own products
  if (req.customer ?.role === "seller" && req.query.mine === "true") {
    query.seller = req.customer ._id;
  }
  
  // If customer  is an admin and requests all products (including unpublished)
  if (req.customer ?.role === "admin" && req.query.all === "true") {
    return query;
  }
  
  // For guests, customers, or when explicitly requested, show published products only
  if (!req.customer  || req.customer .role === "customer" || req.query.published === "true") {
    query.isPublished = true; 
  }
  return query;
}

// 1. Get all products
exports.getAll = async (req, res) => {
  const query = buildQuery(req);

  const products = await Product.find(query)
    .populate("seller", "name email storeName")
    .sort("name"); // Sort alphabetically by product name
  res.status(200).send(products);
};

// 2. Get products belonging to the logged-in seller
exports.getMine = async (req, res) => {
  const products = await Product.find({ seller: req.customer ._id })
    .populate("seller", "name email storeName")
    .sort("-dateCreated");
  res.status(200).send(products);
};

// 3. Get a single product by ID
exports.getById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("seller", "name email storeName");

  if (!product) {
    return res.status(404).send({ message: "Product not found." });
  }

  // Check visibility if the product is not published
  if (!product.isPublished) {
    const canView =
      req.customer  &&
      (req.customer .role === "admin" || canModifyProduct(req.customer , product));
    if (!canView) {
      return res.status(404).send({ message: "Product not found." });
    }
  }

  res.status(200).send(product);
};

// 4. Verify product purchase (Optional: Useful for post-purchase downloads or features)
exports.getPurchaseStatus = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("seller", "name email storeName");

  if (!product) {
    return res.status(404).send({ message: "Product not found." });
  }

  const allowed = await canAccessProductMedia(req.customer , product);
  if (!allowed) {
    return res.status(403).send({ message: "You must purchase this product to access its exclusive files." });
  }

  res.status(200).send(product);
};

// Extract and organize product data from request body and uploaded files
function buildProductFromBody(req) {
  const files = req.files || {};
  const coverFile = files.productImage && files.productImage[0];
  const sliderFiles = files.productSliderImages || [];

  const image = coverFile
    ? uploadsPath(coverFile.filename)
    : req.body.image;

  const productSliderImages =
    sliderFiles.length > 0
      ? sliderPathsFromFiles(sliderFiles)
      : req.body.productSliderImages;

  return {
    name: req.body.name,
    brand: req.body.brand,
    category: req.body.category,
    subCategory: req.body.subCategory,
    price: req.body.price,
    discount: req.body.discount || 0,
    image,
    productSliderImages,
    productRelated: req.body.productRelated || [],
    generics: req.body.generics,
    usedFor: req.body.usedFor,
    howItWorks: req.body.howItWorks,
    precautions: req.body.precautions,
    sideEffects: req.body.sideEffects,
    description: req.body.description || req.body.discription,
    tags: parseTags(req.body),
    isPublished: req.body.isPublished === true || req.body.isPublished === "true",
    seller: req.customer .role === "seller" ? req.customer ._id : req.body.seller || req.customer ._id,
  };
}

// 5. Create a new product
exports.create = async (req, res) => {
  req.body.tags = parseTags(req.body);
  const { error } = handleProductValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const payload = buildProductFromBody(req);
  if (req.customer .role === "seller") {
    payload.seller = req.customer ._id;
  } else if (req.customer .role === "admin" && req.body.seller) {
    payload.seller = req.body.seller;
  }

  const product = new Product(payload);
  const result = await product.save();
  const populated = await Product.findById(result._id)
    .populate("seller", "name email storeName");
  res.status(201).send(populated);
};

// 6. Update an existing product
exports.update = async (req, res) => {
  req.body.tags = parseTags(req.body);
  const { error } = handleProductValidation(req.body);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).send({ message: errorMessages.join(", ") });
  }

  const existing = await Product.findById(req.params.id);
  if (!existing) {
    return res.status(404).send({ message: "Product not found." });
  }

  if (req.customer .role !== "admin" && !canModifyProduct(req.customer , existing)) {
    return res.status(403).send({ message: "Access denied." });
  }

  const payload = buildProductFromBody(req);
  if (req.customer .role === "seller") {
    payload.seller = existing.seller || req.customer ._id;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
  }).populate("seller", "name email storeName");

  res.status(200).send(product);
};

// 7. Toggle product visibility (Publish/Unpublish status)
exports.setPublished = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send({ message: "Product not found." });
  }

  if (typeof req.body.isPublished !== "boolean") {
    return res.status(400).send({ message: "isPublished must be a boolean." });
  }

  product.isPublished = req.body.isPublished;
  await product.save();

  const populated = await Product.findById(product._id)
    .populate("seller", "name email storeName");

  res.send(populated);
};

// 8. Delete a product
exports.delete = async (req, res) => {
  const existing = await Product.findById(req.params.id);
  if (!existing) {
    return res.status(404).send({ message: "Product not found." });
  }

  if (req.customer .role === "seller" && !canModifyProduct(req.customer , existing)) {
    return res.status(403).send({ message: "Access denied." });
  }

  const product = await Product.findByIdAndDelete(req.params.id);
  
  // Optional: Add order cleanup logic if necessary for your business logic
  // await Order.deleteMany({ product: product._id }); 
  
  res.status(200).send(product);
};
