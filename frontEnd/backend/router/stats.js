const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const statsController = require("../controllers/statsController");

const router = express.Router();

router.get("/admin", auth, authorize("admin"), statsController.admin);
router.get("/teacher", auth, authorize("teacher", "admin"), statsController.teacher);
router.get("/student", auth, authorize("student"), statsController.student);

module.exports = router;
