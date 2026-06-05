const multer = require("multer");

// Configure disk storage parameters for catalog uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Specify the target destination directory on the server file partition
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Prefix names with timestamps to avoid file naming collisions
  },
});

// Enforce strict file type white-lists for media assets
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true); // Process and accept the incoming image buffer stream
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, PNG, and WEBP are allowed."), false); // Reject unauthorized file extensions safely
  }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Multi-part form-data field boundary configuration rules for retail inventories
const productImagesUpload = upload.fields([
  { name: "productImage", maxCount: 1 }, // Replaced productCover with standard commercial productImage fields
  { name: "productSliderImages", maxCount: 10 }, // Normalized maximum carousel limits for item displays
]);

module.exports = { upload, productImagesUpload };
