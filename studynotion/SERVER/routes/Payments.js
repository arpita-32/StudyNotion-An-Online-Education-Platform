// Import the required modules
const express = require("express")
const router = express.Router()
const { sendPaymentSuccessEmail, verifySignature } = require("../controllers/Payment")
const { auth, isStudent } = require("../middlewares/auth");
const { startPayment } = require("../controllers/Payment");


router.post("/verifySignature",auth, isStudent, verifySignature)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);
router.post('/create-checkout-session', startPayment);


module.exports = router;