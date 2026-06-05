const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const statsController = require("../controllers/statsController");

const router = express.Router();

router.get("/admin", auth, authorize("admin"), statsController.admin);
router.get("/seller", auth, authorize("seller", "admin"), statsController.seller);
router.get("/customer", auth, authorize("customer", "admin"), statsController.customer);

module.exports = router;
