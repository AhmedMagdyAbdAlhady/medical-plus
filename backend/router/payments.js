const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const paymentsController = require("../controllers/paymentsController");

const router = express.Router();

router.post("/checkout", [auth, authorize("customer")], paymentsController.createCheckout);
router.post("/verify", [auth, authorize("customer")], paymentsController.verifyCheckout);
router.get("/my-products", [auth, authorize("customer")], paymentsController.myProducts);
router.get("/my-payments", [auth, authorize("customer")], paymentsController.myPayments);
router.get("/check/:productId", [auth, authorize("customer")], paymentsController.checkEnrollment);
router.get("/admin", [auth, authorize("admin")], paymentsController.adminPayments);

module.exports = router;
