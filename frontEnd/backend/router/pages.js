const express = require("express");
const pagesController = require("../controllers/pagesController");

const router = express.Router();

router.get("/", pagesController.home);
router.get("/courses", pagesController.courses);
router.get("/authors", pagesController.authors);

module.exports = router;
