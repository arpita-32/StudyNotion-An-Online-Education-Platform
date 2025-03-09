"use strict";

// Import the required modules
var express = require("express");

var router = express.Router(); // Import the required controllers and middleware functions

var _require = require("../controllers/Auth"),
    Login = _require.Login,
    Signup = _require.Signup,
    GenerateOtp = _require.GenerateOtp,
    ChangePassword = _require.ChangePassword;

var _require2 = require("../controllers/ResetPassword"),
    CreateResetToken = _require2.CreateResetToken,
    ResetPassword = _require2.ResetPassword;

var _require3 = require("../middlewares/auth"),
    auth = _require3.auth; // Routes for Login, Signup, and Authentication
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
// Route for user login


router.post("/login", Login); // Route for user signup

router.post("/signup", Signup); // Route for sending OTP to the user's email

router.post("/generateOtp", GenerateOtp); // Route for Changing the password

router.post("/changepassword", auth, ChangePassword); // ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************
// Route for generating a reset password token

router.post("/reset-password-token", CreateResetToken); // Route for resetting user's password after verification

router.post("/reset-password", ResetPassword); // Export the router for use in the main application

module.exports = router;
//# sourceMappingURL=User.dev.js.map
