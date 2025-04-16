const express = require("express");
const router = express.Router();

const { createPaymentIntent, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments");
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/create-payment-intent", auth, isStudent, createPaymentIntent);
router.post("/verify-payment", auth, isStudent, verifyPayment);
router.post("/send-payment-success-email", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router;