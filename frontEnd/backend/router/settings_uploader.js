const multer = require("multer");
const path = require("path");
const fs = require("fs");

const settingsDir = "./uploads/settings/";
if (!fs.existsSync(settingsDir)) {
  fs.mkdirSync(settingsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, settingsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

const settingsUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]);

module.exports = { settingsUpload };
