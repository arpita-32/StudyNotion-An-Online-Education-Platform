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

require("dotenv").config();

exports.signup = function _callee(req, res) {
  var _req$body, firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp, existingUser, recentOtp, otpCreationTime, currentTime, timeDifference, hashedPassword, profile, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password, confirmPassword = _req$body.confirmPassword, accountType = _req$body.accountType, contactNumber = _req$body.contactNumber, otp = _req$body.otp; // Validate required fields

          if (!(!firstName || !lastName || !email || !password || !confirmPassword || !otp)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
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
            message: "Password and Confirm Password do not match"
          }));

        case 6:
          if (!(password.length < 8)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
          }));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 10:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "User already exists. Please sign in to continue."
          }));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(OTP.find({
            email: email
          }).sort({
            createdAt: -1
          }).limit(1));

        case 15:
          recentOtp = _context.sent;

          if (!(recentOtp.length === 0)) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "OTP not found. Please request a new OTP."
          }));

        case 18:
          if (!(otp !== recentOtp[0].otp)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid OTP. Please try again."
          }));

        case 20:
          // Check OTP expiry (assuming 5 minutes validity)
          otpCreationTime = recentOtp[0].createdAt;
          currentTime = new Date();
          timeDifference = (currentTime - otpCreationTime) / (1000 * 60); // in minutes

          if (!(timeDifference > 5)) {
            _context.next = 25;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "OTP has expired. Please request a new one."
          }));

        case 25:
          _context.next = 27;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 27:
          hashedPassword = _context.sent;
          _context.next = 30;
          return regeneratorRuntime.awrap(Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber || null
          }));

        case 30:
          profile = _context.sent;

          if (profile) {
            _context.next = 33;
            break;
          }

          throw new Error("Error creating user profile");

        case 33:
          _context.next = 35;
          return regeneratorRuntime.awrap(User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contactNumber,
            password: hashedPassword,
            accountType: accountType || "Student",
            approved: accountType === "Instructor" ? false : true,
            additionalDetails: profile._id,
            image: "https://api.dicebear.com/5.x/initials/svg?seed=".concat(firstName, " ").concat(lastName)
          }));

        case 35:
          user = _context.sent;
          // Remove sensitive information
          user.password = undefined;
          return _context.abrupt("return", res.status(201).json({
            success: true,
            user: user,
            message: "User registered successfully"
          }));

        case 40:
          _context.prev = 40;
          _context.t0 = _context["catch"](0);
          console.error("Signup Error:", _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: _context.t0.message || "Registration failed. Please try again later."
          }));

        case 44:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 40]]);
};

exports.login = function _callee2(req, res) {
  var _req$body2, email, password, user, isPasswordValid, token, options;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Please provide both email and password"
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
            message: "Account not found. Please sign up."
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 11:
          isPasswordValid = _context2.sent;

          if (isPasswordValid) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            success: false,
            message: "Invalid credentials"
          }));

        case 14:
          // Generate JWT token
          token = jwt.sign({
            email: user.email,
            id: user._id,
            role: user.accountType
          }, process.env.JWT_SECRET, {
            expiresIn: "24h"
          }); // Remove sensitive data

          user.password = undefined; // Set cookie

          options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            // 3 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
          };
          return _context2.abrupt("return", res.cookie("token", token, options).status(200).json({
            success: true,
            token: token,
            user: user,
            message: "Logged in successfully"
          }));

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](0);
          console.error("Login Error:", _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: _context2.t0.message || "Login failed. Please try again."
          }));

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

exports.sendotp = function _callee3(req, res) {
  var email, existingUser, otp, otpDoc;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          email = req.body.email;

          if (email) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Email is required"
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          existingUser = _context3.sent;

          if (!existingUser) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "User already exists"
          }));

        case 9:
          // Generate OTP
          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          }); // Save OTP

          _context3.next = 12;
          return regeneratorRuntime.awrap(OTP.create({
            email: email,
            otp: otp,
            createdAt: Date.now()
          }));

        case 12:
          otpDoc = _context3.sent;
          return _context3.abrupt("return", res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otp
          }));

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          console.error("SendOTP Error:", _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: _context3.t0.message || "Failed to send OTP"
          }));

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.changePassword = function _callee4(req, res) {
  var _req$body3, oldPassword, newPassword, userId, user, isPasswordValid, hashedNewPassword;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body3 = req.body, oldPassword = _req$body3.oldPassword, newPassword = _req$body3.newPassword;
          userId = req.user.id;

          if (!(!oldPassword || !newPassword)) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Both old and new passwords are required"
          }));

        case 5:
          if (!(newPassword.length < 8)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "New password must be at least 8 characters long"
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 9:
          user = _context4.sent;

          if (user) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 12:
          _context4.next = 14;
          return regeneratorRuntime.awrap(bcrypt.compare(oldPassword, user.password));

        case 14:
          isPasswordValid = _context4.sent;

          if (isPasswordValid) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            success: false,
            message: "Current password is incorrect"
          }));

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 19:
          hashedNewPassword = _context4.sent;
          // Update password
          user.password = hashedNewPassword;
          _context4.next = 23;
          return regeneratorRuntime.awrap(user.save());

        case 23:
          _context4.prev = 23;
          _context4.next = 26;
          return regeneratorRuntime.awrap(mailSender(user.email, "Password Updated", passwordUpdated(user.email, "Password updated successfully for ".concat(user.firstName, " ").concat(user.lastName))));

        case 26:
          _context4.next = 31;
          break;

        case 28:
          _context4.prev = 28;
          _context4.t0 = _context4["catch"](23);
          console.error("Password update email failed:", _context4.t0); // Continue with success response even if email fails

        case 31:
          return _context4.abrupt("return", res.status(200).json({
            success: true,
            message: "Password updated successfully"
          }));

        case 34:
          _context4.prev = 34;
          _context4.t1 = _context4["catch"](0);
          console.error("Change Password Error:", _context4.t1);
          return _context4.abrupt("return", res.status(500).json({
            success: false,
            message: _context4.t1.message || "Failed to update password"
          }));

        case 38:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 34], [23, 28]]);
};
//# sourceMappingURL=Auth.dev.js.map
