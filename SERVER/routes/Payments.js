// Import the required modules
const express = require("express");
const router = express.Router();

// Import payment controllers and middlewares
const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail,
} = require("../controllers/Payments");

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// Define routes for payment-related functionalities
router.post("/capturePayment", auth, isStudent, capturePayment); // Endpoint to capture payment
router.post("/verifyPayment", auth, isStudent, verifyPayment); // Endpoint to verify payment
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail); // Endpoint to send success email

// Export the router
module.exports = router;
