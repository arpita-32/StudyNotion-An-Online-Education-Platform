"use strict";

var User = require("../models/User");

var OTP = require("../models/OTP");

var otpGenerator = require("otp-generator");

var bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

require("dotenv").config(); //sendOTP


exports.sendOTP = function _callee(req, res) {
  var email, checkUserPresent, otp, result, otpPayload, otpBody;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          email = req.body.email;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          checkUserPresent = _context.sent;

          if (!checkUserPresent) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: 'User already registered'
          }));

        case 7:
          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          });
          console.log("OTP generated:", otp);
          _context.next = 11;
          return regeneratorRuntime.awrap(OTP.findOne({
            otp: otp
          }));

        case 11:
          result = _context.sent;

        case 12:
          if (!result) {
            _context.next = 19;
            break;
          }

          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          });
          _context.next = 16;
          return regeneratorRuntime.awrap(OTP.findOne({
            otp: otp
          }));

        case 16:
          result = _context.sent;
          _context.next = 12;
          break;

        case 19:
          otpPayload = {
            email: email,
            otp: otp
          };
          _context.next = 22;
          return regeneratorRuntime.awrap(OTP.create(otpPayload));

        case 22:
          otpBody = _context.sent;
          console.log(otpBody);
          res.status(200).json({
            success: true,
            message: 'otp sent successfully',
            otp: otp
          });
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: _context.t0.message
          }));

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.signUp = function _callee2(req, res) {
  var _req$body, firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp, existingUser, recentOtp, hashedPassword, profileDetails, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password, confirmPassword = _req$body.confirmPassword, accountType = _req$body.accountType, contactNumber = _req$body.contactNumber, otp = _req$body.otp;

          if (!(!firstName || !lastName || !email || !password || !confirmPassword || !otp)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            success: false,
            message: "All fields are required"
          }));

        case 4:
          if (!(password !== confirmPassword)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Password and confirmpassword value does not match,please try again'
          }));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 8:
          existingUser = _context2.sent;

          if (!existingUser) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "User is already registered"
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(OTP.find({
            email: email
          }).sort({
            createdAt: -1
          }).limit(1));

        case 13:
          recentOtp = _context2.sent;
          console.log(recentOtp);

          if (!(recentOtp.length == 0)) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "otp found"
          }));

        case 19:
          if (!(otp !== recentOtp.otp)) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid otp"
          }));

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 23:
          hashedPassword = _context2.sent;
          _context2.next = 26;
          return regeneratorRuntime.awrap(Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
          }));

        case 26:
          profileDetails = _context2.sent;
          _context2.next = 29;
          return regeneratorRuntime.awrap(User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contactNumber,
            password: hashedPassword,
            accountType: accountType,
            additionalDetails: profileDetails._id,
            image: "https://api.dicebear.com/5.x/initials/svg?seed=".concat(firstName, " ").concat(lastName)
          }));

        case 29:
          user = _context2.sent;
          return _context2.abrupt("return", res.status(4200).json({
            success: true,
            message: 'User is registered successfully'
          }));

        case 33:
          _context2.prev = 33;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'User cannot be registered .please try again'
          }));

        case 37:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 33]]);
};

exports.login = function _callee3(req, res) {
  var _req$body2, email, password, user, payload, token, options;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            success: false,
            message: 'all fields are required please try again'
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).populate("additionalDetails"));

        case 6:
          user = _context3.sent;

          if (user) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(401).json({
            success: false,
            message: 'User is not  registered .please signup first'
          }));

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 11:
          if (!_context3.sent) {
            _context3.next = 20;
            break;
          }

          payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
          };
          token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
          });
          user.token = token;
          user.password = undefined;
          options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
            httpOnly: true
          };
          res.cookie("token", token, options).status(200).json({
            success: true,
            token: token,
            user: user,
            message: 'logged in successfully'
          });
          _context3.next = 21;
          break;

        case 20:
          return _context3.abrupt("return", res.status(401).json({
            success: false,
            message: 'pssword is incorrect'
          }));

        case 21:
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: 'User is not registered .please signup'
          }));

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

exports.changePassword = function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {} catch (error) {}

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};
//# sourceMappingURL=Auth.dev.js.map
