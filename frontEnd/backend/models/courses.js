const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 100 },
  description: { type: String, required: true, minlength: 25, maxlength: 1024 },
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
  category: {
    type: String,
    required: true,
    enum: ["medicine", "surgery", "pharmacy", "nursing", "dentistry"],
    lowercase: true,
    trim: true,
  },
  discount: { type: Number, default: 0 },
  productCover: String,
  productSliderImages: {
    type: [String],
    default: [],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

function handleProductValidation(products) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(25).max(1024).required(),
    price: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).optional(),
    productCover: Joi.string().optional().allow(""),
    productSliderImages: Joi.array().items(Joi.string()).optional(),
    author: Joi.string().required(),
    tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).required(),
    isPublished: Joi.boolean().required(),
    category: Joi.string().valid("medicine", "surgery", "pharmacy", "nursing", "dentistry").required(),
  });

  return schema.validate(products);
}

exports.Product = Product;
exports.handleProductValidation = handleProductValidation;
