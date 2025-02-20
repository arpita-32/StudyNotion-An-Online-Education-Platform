// Import the required modules
const express = require("express")
const router = express.Router()

const {  sendPaymentSuccessEmail } = require("../controllers/Payment")

const { auth, isStudent } = require("../middlewares/auth");

const { startPayment } = require("../controllers/Payment");



router.post('/create-checkout-session', startPayment);


module.exports = router;