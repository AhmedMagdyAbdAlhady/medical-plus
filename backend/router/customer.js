const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const authorize = require("../middleware/authorize");
const customerController = require("../controllers/customerController");
const express = require("express");
const router = express.Router();

router.get("/", [auth, admin], customerController.getAll);
router.get("/me", auth, customerController.getMe);
router.patch("/me", auth, customerController.updateMe);
router.post("/register", customerController.create);
router.post("/", [auth, admin], customerController.createByAdmin);
router.patch("/:id", [auth, admin], customerController.updateById);
router.patch("/:id/active", [auth, admin], customerController.setActive);
router.delete("/:id", [auth, admin], customerController.remove);

module.exports = router;
