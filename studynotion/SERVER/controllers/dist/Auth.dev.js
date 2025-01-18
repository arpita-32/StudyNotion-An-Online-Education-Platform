"use strict";

var bcrypt = require("bcryptjs");

var User = require("../models/User");

var OTP = require("../models/OTP");

var jwt = require("jsonwebtoken");

var otpGenerator = require("otp-generator");

var mailSender = require("../utils/mailSender");

var _require = require("../mail/passwordUpdate"),
    passwordUpdated = _require.passwordUpdated;

var Profile = require("../models/Profile");

require("dotenv").config(); // Signup Controller for Registering USers


exports.signup = function _callee(req, res) {
  var _req$body, firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp, existingUser, response, hashedPassword, approved, profileDetails, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Destructure fields from the request body
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password, confirmPassword = _req$body.confirmPassword, accountType = _req$body.accountType, contactNumber = _req$body.contactNumber, otp = _req$body.otp; // Check if All Details are there or not

          if (!(!firstName || !lastName || !email || !password || !confirmPassword || !otp)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(403).send({
            success: false,
            message: "All Fields are required"
          }));

        case 4:
          if (!(password !== confirmPassword)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Password and Confirm Password do not match. Please try again."
          }));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 8:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "User already exists. Please sign in to continue."
          }));

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(OTP.find({
            email: email
          }).sort({
            createdAt: -1
          }).limit(1));

        case 13:
          response = _context.sent;
          console.log(response);

          if (!(response.length === 0)) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "The OTP is not valid"
          }));

        case 19:
          if (!(otp !== response[0].otp)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "The OTP is not valid"
          }));

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 23:
          hashedPassword = _context.sent;
          // Create the user
          approved = "";
          approved === "Instructor" ? approved = false : approved = true; // Create the Additional Profile For User

          _context.next = 28;
          return regeneratorRuntime.awrap(Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
          }));

        case 28:
          profileDetails = _context.sent;
          _context.next = 31;
          return regeneratorRuntime.awrap(User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: ""
          }));

        case 31:
          user = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            user: user,
            message: "User registered successfully"
          }));

        case 35:
          _context.prev = 35;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again."
          }));

        case 39:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 35]]);
}; // Login controller for authenticating users


exports.login = function _callee2(req, res) {
  var _req$body2, email, password, user, token, options;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Get email and password from request body
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; // Check if email or password is missing

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Please Fill up All the Required Fields"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).populate("additionalDetails"));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            success: false,
            message: "User is not Registered with Us Please SignUp to Continue"
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 11:
          if (!_context2.sent) {
            _context2.next = 19;
            break;
          }

          token = jwt.sign({
            email: user.email,
            id: user._id,
            accountType: user.accountType
          }, process.env.JWT_SECRET, {
            expiresIn: "24h"
          }); // Save token to user document in database

          user.token = token;
          user.password = undefined; // Set cookie for token and return success response

          options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
          };
          res.cookie("token", token, options).status(200).json({
            success: true,
            token: token,
            user: user,
            message: "User Login Success"
          });
          _context2.next = 20;
          break;

        case 19:
          return _context2.abrupt("return", res.status(401).json({
            success: false,
            message: "Password is incorrect"
          }));

        case 20:
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0); // Return 500 Internal Server Error status code with error message

          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "Login Failure Please Try Again"
          }));

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 22]]);
}; // Send OTP For Email Verification


exports.sendotp = function _callee3(req, res) {
  var email, checkUserPresent, otp, result, otpPayload, otpBody;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          email = req.body.email; // Check if user is already present
          // Find user with provided email

          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          checkUserPresent = _context3.sent;

          if (!checkUserPresent) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(401).json({
            success: false,
            message: "User is Already Registered"
          }));

        case 7:
          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          });
          _context3.next = 10;
          return regeneratorRuntime.awrap(OTP.findOne({
            otp: otp
          }));

        case 10:
          result = _context3.sent;
          console.log("Result is Generate OTP Func");
          console.log("OTP", otp);
          console.log("Result", result);

          while (result) {
            otp = otpGenerator.generate(6, {
              upperCaseAlphabets: false
            });
          }

          otpPayload = {
            email: email,
            otp: otp
          };
          _context3.next = 18;
          return regeneratorRuntime.awrap(OTP.create(otpPayload));

        case 18:
          otpBody = _context3.sent;
          console.log("OTP Body", otpBody);
          res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp: otp
          });
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0.message);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            error: _context3.t0.message
          }));

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // Controller for Changing Password


exports.changePassword = function _callee4(req, res) {
  var userDetails, _req$body3, oldPassword, newPassword, isPasswordMatch, encryptedPassword, updatedUserDetails, emailResponse;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 3:
          userDetails = _context4.sent;
          // Get old password, new password, and confirm new password from req.body
          _req$body3 = req.body, oldPassword = _req$body3.oldPassword, newPassword = _req$body3.newPassword; // Validate old password

          _context4.next = 7;
          return regeneratorRuntime.awrap(bcrypt.compare(oldPassword, userDetails.password));

        case 7:
          isPasswordMatch = _context4.sent;

          if (isPasswordMatch) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            success: false,
            message: "The password is incorrect"
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 12:
          encryptedPassword = _context4.sent;
          _context4.next = 15;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            password: encryptedPassword
          }, {
            "new": true
          }));

        case 15:
          updatedUserDetails = _context4.sent;
          _context4.prev = 16;
          _context4.next = 19;
          return regeneratorRuntime.awrap(mailSender(updatedUserDetails.email, "Password for your account has been updated", passwordUpdated(updatedUserDetails.email, "Password updated successfully for ".concat(updatedUserDetails.firstName, " ").concat(updatedUserDetails.lastName))));

        case 19:
          emailResponse = _context4.sent;
          console.log("Email sent successfully:", emailResponse.response);
          _context4.next = 27;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](16);
          // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
          console.error("Error occurred while sending email:", _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: _context4.t0.message
          }));

        case 27:
          return _context4.abrupt("return", res.status(200).json({
            success: true,
            message: "Password updated successfully"
          }));

        case 30:
          _context4.prev = 30;
          _context4.t1 = _context4["catch"](0);
          // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
          console.error("Error occurred while updating password:", _context4.t1);
          return _context4.abrupt("return", res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: _context4.t1.message
          }));

        case 34:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 30], [16, 23]]);
};
//# sourceMappingURL=Auth.dev.js.map
