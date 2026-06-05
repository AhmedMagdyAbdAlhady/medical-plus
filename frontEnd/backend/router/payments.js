const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const paymentsController = require("../controllers/paymentsController");

const router = express.Router();

router.post("/checkout", [auth, authorize("student")], paymentsController.createCheckout);
router.post("/verify", [auth, authorize("student")], paymentsController.verifyCheckout);
router.get("/my-courses", [auth, authorize("student")], paymentsController.myCourses);
router.get("/my-payments", [auth, authorize("student")], paymentsController.myPayments);
router.get("/check/:courseId", auth, paymentsController.checkEnrollment);
router.get("/admin", [auth, authorize("admin")], paymentsController.adminPayments);

module.exports = router;
