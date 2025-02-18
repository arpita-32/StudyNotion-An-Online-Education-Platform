// Import the required modules
const express = require("express")
const router = express.Router()

const {  sendPaymentSuccessEmail } = require("../controllers/Payment")

const { auth, isStudent } = require("../middlewares/auth");

const { startPayment, verifySignature } = require("../controllers/Payment");
router.post("/create-checkout-session", startPayment);
router.post("/webhook", verifySignature);



module.exports = router;