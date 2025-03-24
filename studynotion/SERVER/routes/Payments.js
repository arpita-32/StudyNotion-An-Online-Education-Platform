const express = require("express");
const router = express.Router();
const { 
  createCheckoutSession,
  handleStripeWebhook,
  sendPaymentSuccessEmail
} = require("../controllers/Payment");
const { auth, isStudent } = require("../middlewares/auth");

// Stripe webhook endpoint (must be before body parser middleware)
router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }), // Needed for signature verification
  handleStripeWebhook
);

// Protected routes (require authentication)
router.post(
  "/create-checkout-session",
  auth,
  isStudent,
  createCheckoutSession
);

router.post(
  "/send-payment-success-email",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

module.exports = router;