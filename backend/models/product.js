const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 100 },
  brand: { type: String, required: true, minlength: 2, maxlength: 50 },
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  subCategory: { type: String, required: true, minlength: 2, maxlength: 50 },
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 2000,
    set: (v) => Math.round(v),
    get: (v) => Math.round(v),
  },
  discount: { type: Number, default: 0 },
  image: { type: String, required: true },
  productSliderImages: {
    type: [String],
    default: [],
  },
  productRelated: {
    type: [Number], // Storing product IDs for related recommendations as per initial schema
    default: [],
  },
  generics: { type: String, required: true, minlength: 2, maxlength: 100 },
  usedFor: { type: String, required: true, minlength: 5, maxlength: 255 },
  howItWorks: { type: String, required: true, minlength: 10, maxlength: 500 },
  precautions: { type: String, required: true, minlength: 10, maxlength: 500 },
  sideEffects: { type: String, required: true, minlength: 10, maxlength: 500 },
  description: { type: String, required: true, minlength: 25, maxlength: 1024 },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer ",
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "tags: At least one tag is required.",
    },
  },
  isPublished: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

/**
 * Validates incoming request payloads for creating or updating products using Joi.
 */
function handleProductValidation(product) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    brand: Joi.string().min(2).max(50).required(),
    category: Joi.string().required(),
    subCategory: Joi.string().min(2).max(50).required(),
    price: Joi.number().min(10).max(2000).required(),
    discount: Joi.number().min(0).optional(),
    image: Joi.string().optional().allow(""),
    productSliderImages: Joi.array().items(Joi.string()).optional(),
    productRelated: Joi.array().items(Joi.number()).optional(),
    generics: Joi.string().min(2).max(100).required(),
    usedFor: Joi.string().min(5).max(255).required(),
    howItWorks: Joi.string().min(10).max(500).required(),
    precautions: Joi.string().min(10).max(500).required(),
    sideEffects: Joi.string().min(10).max(500).required(),
    description: Joi.string().min(25).max(1024).required(),
    seller: Joi.string().optional(), // Injected automatically from authentication tokens
    tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).required(),
    isPublished: Joi.boolean().required(),
  });

  return schema.validate(product);
}

exports.Product = Product;
exports.handleProductValidation = handleProductValidation;
