"use strict";

// Import the required modules
var express = require("express");

var router = express.Router(); // Import the required controllers and middleware functions

var _require = require("../controllers/Auth"),
    login = _require.login,
    signup = _require.signup,
    sendotp = _require.sendotp,
    changePassword = _require.changePassword;

var _require2 = require("../controllers/ResetPassword"),
    resetPasswordToken = _require2.resetPasswordToken,
    resetPassword = _require2.resetPassword;

var _require3 = require("../middlewares/auth"),
    auth = _require3.auth; // Routes for Login, Signup, and Authentication
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
// Route for user login


router.post("/login", login); // Route for user signup

router.post("/signup", signup); // Route for sending OTP to the user's email

router.post("/sendotp", sendotp); // Route for Changing the password

router.post("/changepassword", auth, changePassword); // ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************
// Route for generating a reset password token

router.post("/reset-password-token", resetPasswordToken); // Route for resetting user's password after verification

router.post("/reset-password", resetPassword); // Export the router for use in the main application

module.exports = router;
//# sourceMappingURL=User.dev.js.map
