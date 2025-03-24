"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/Payment"),
    createCheckoutSession = _require.createCheckoutSession,
    handleStripeWebhook = _require.handleStripeWebhook,
    sendPaymentSuccessEmail = _require.sendPaymentSuccessEmail;

var _require2 = require("../middlewares/auth"),
    auth = _require2.auth,
    isStudent = _require2.isStudent; // Stripe webhook endpoint (must be before body parser middleware)


router.post("/stripe-webhook", express.raw({
  type: "application/json"
}), // Needed for signature verification
handleStripeWebhook); // Protected routes (require authentication)

router.post("/create-checkout-session", auth, isStudent, createCheckoutSession);
router.post("/send-payment-success-email", auth, isStudent, sendPaymentSuccessEmail);
module.exports = router;
//# sourceMappingURL=Payments.dev.js.map
