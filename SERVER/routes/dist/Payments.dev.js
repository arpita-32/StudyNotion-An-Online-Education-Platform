"use strict";

// Import the required modules
var express = require("express");

var router = express.Router(); // Import payment controllers and middlewares

var _require = require("../controllers/Payments"),
    capturePayment = _require.capturePayment,
    verifyPayment = _require.verifyPayment,
    sendPaymentSuccessEmail = _require.sendPaymentSuccessEmail;

var _require2 = require("../middlewares/auth"),
    auth = _require2.auth,
    isInstructor = _require2.isInstructor,
    isStudent = _require2.isStudent,
    isAdmin = _require2.isAdmin; // Define routes for payment-related functionalities


router.post("/capturePayment", auth, isStudent, capturePayment); // Endpoint to capture payment

router.post("/verifyPayment", auth, isStudent, verifyPayment); // Endpoint to verify payment

router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail); // Endpoint to send success email
// Export the router

module.exports = router;
//# sourceMappingURL=Payments.dev.js.map
