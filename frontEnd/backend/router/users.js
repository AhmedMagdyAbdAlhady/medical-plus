const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const authorize = require("../middleware/authorize");
const userController = require("../controllers/userController");
const express = require("express");
const router = express.Router();

router.get("/", [auth, admin], userController.getAll);
router.get("/me", auth, userController.getMe);
router.patch("/me", auth, userController.updateMe);
router.post("/register", userController.create);
router.post("/", [auth, admin], userController.createByAdmin);
router.patch("/:id", [auth, admin], userController.updateById);
router.patch("/:id/active", [auth, admin], userController.setActive);
router.delete("/:id", [auth, admin], userController.remove);

module.exports = router;
