const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const authorsController = require("../controllers/authorsController");

const router = express.Router();

router.get("/", authorsController.getAll);
router.get("/:id", authorsController.getById);
router.post("/", [auth, authorize("admin")], authorsController.create);
router.put("/:id", [auth, authorize("admin")], authorsController.update);
router.delete("/:id", [auth, authorize("admin")], authorsController.delete);

module.exports = router;
