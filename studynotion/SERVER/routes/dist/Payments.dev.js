"use strict";

// Import the required modules
var express = require("express");

var router = express.Router();

var _require = require("../controllers/Payment"),
    capturePayment = _require.capturePayment,
    verifyPayment = _require.verifyPayment,
    sendPaymentSuccessEmail = _require.sendPaymentSuccessEmail;

var _require2 = require("../middlewares/auth"),
    auth = _require2.auth,
    isInstructor = _require2.isInstructor,
    isStudent = _require2.isStudent,
    isAdmin = _require2.isAdmin;

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);
module.exports = router;
//# sourceMappingURL=Payments.dev.js.map
