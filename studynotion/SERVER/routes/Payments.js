const express = require("express");
const router = express.Router();

const {
    capturePayment,
    handlePaymentSuccess,
} = require("../controllers/Payment");

const { auth, isStudent } = require("../middlewares/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/paymentSuccess", auth, isStudent, handlePaymentSuccess);

module.exports = router;