const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const settingsController = require("../controllers/settingsController");
const { settingsUpload } = require("./settings_uploader");

const router = express.Router();

router.get("/", settingsController.get);
router.put("/", [auth, admin, settingsUpload], settingsController.update);

module.exports = router;
