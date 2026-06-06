import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      default: "Generic",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    subCategory: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Image path is required"],
    },
    productRelated: {
      type: [Number],
      default: [],
    },
    generics: {
      type: String,
      default: "N/A",
    },
    usedFor: {
      type: String,
      default: "General health",
    },
    howItWorks: {
      type: String,
      default: "Information not available",
    },
    precautions: {
      type: String,
      default: "None specified",
    },
    sideEffects: {
      type: String,
      default: "None known",
    },
    description: {
      type: String,
      default: "",
    },
    isBestForLess: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 50,
      min: [0, "Stock cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
