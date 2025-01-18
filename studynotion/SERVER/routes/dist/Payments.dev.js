"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/Payment"),
    capturePayment = _require.capturePayment,
    handlePaymentSuccess = _require.handlePaymentSuccess;

var _require2 = require("../middlewares/auth"),
    auth = _require2.auth,
    isStudent = _require2.isStudent;

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/paymentSuccess", auth, isStudent, handlePaymentSuccess);
module.exports = router;
//# sourceMappingURL=Payments.dev.js.map
