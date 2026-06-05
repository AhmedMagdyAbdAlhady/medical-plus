const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const coursesController = require("../controllers/coursesController");
const { courseImagesUpload } = require("./courses_uploader");

const router = express.Router();

router.get("/", coursesController.getAll);
router.get("/mine", [auth, authorize("teacher", "admin")], coursesController.getMine);
router.get("/:id/learn", auth, coursesController.getLearn);
router.get("/:id", coursesController.getById);
router.post(
  "/",
  [auth, authorize("admin", "teacher"), courseImagesUpload],
  coursesController.create,
);
router.put(
  "/:id",
  [auth, authorize("admin", "teacher"), courseImagesUpload],
  coursesController.update,
);
router.patch(
  "/:id/publish",
  [auth, authorize("admin")],
  coursesController.setPublished,
);
router.delete(
  "/:id",
  [auth, authorize("admin", "teacher")],
  coursesController.delete,
);

module.exports = router;
