const multer = require("multer");

// configure multer for file uploads storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // specify the filename for the uploaded file
  },
});

// filter the uploaded files to accept
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true); // accept the file
  } else {
    cb(new Error("Invalid file type"), false); // reject the file
  }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// single cover & multiple images uploads for courses
const courseImagesUpload = upload.fields([
  { name: "courseCover", maxCount: 1 },
  { name: "courseSliderImages", maxCount: 20 },
]);

module.exports = { upload, courseImagesUpload };