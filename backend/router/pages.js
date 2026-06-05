const express = require("express");
const pagesController = require("../controllers/pagesController");

const router = express.Router();

router.get("/", pagesController.home);
router.get("/products", pagesController.products);
router.get("/sellers", pagesController.sellers);

module.exports = router;
