const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const productsController = require("../controllers/productsController");
const { productImagesUpload } = require("./products_uploader");

const router = express.Router();

router.get("/", productsController.getAll);

router.get("/mine", [auth, authorize("seller", "admin")], productsController.getMine);

router.get("/:id", productsController.getById);

router.post(
  "/",
  [auth, authorize("admin", "seller"), productImagesUpload],
  productsController.create,
);

router.put(
  "/:id",
  [auth, authorize("admin", "seller"), productImagesUpload],
  productsController.update,
);

router.patch(
  "/:id/visibility",
  [auth, authorize("admin")],
  productsController.setPublished,
);

// 7. حذف منتج من المتجر
router.delete(
  "/:id",
  [auth, authorize("admin", "seller")],
  productsController.delete,
);

module.exports = router;
