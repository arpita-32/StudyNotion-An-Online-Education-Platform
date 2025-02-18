"use strict";

// Import the required modules
var express = require("express");

var router = express.Router();

var _require = require("../controllers/Payment"),
    sendPaymentSuccessEmail = _require.sendPaymentSuccessEmail;

var _require2 = require("../middlewares/auth"),
    auth = _require2.auth,
    isStudent = _require2.isStudent;

var _require3 = require("../controllers/Payment"),
    startPayment = _require3.startPayment,
    verifySignature = _require3.verifySignature;

router.post("/create-checkout-session", startPayment);
router.post("/webhook", verifySignature);
module.exports = router;
//# sourceMappingURL=Payments.dev.js.map
