"use strict";

var User = require("../models/User");

var OTP = require("../models/OTP");

var otpGenerator = require("otp-generator"); //sendOTP


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
  var _req$body, firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp, existingUser, recentOtp, hashedPassword, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password, confirmPassword = _req$body.confirmPassword, accountType = _req$body.accountType, contactNumber = _req$body.contactNumber, otp = _req$body.otp;

          if (!(!firstName || !lastName || !email || !password || !confirmPassword || !otp)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            success: false,
            message: "All fields are required"
          }));

        case 3:
          if (!(password !== confirmPassword)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Password and confirmpassword value does not match,please try again'
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 7:
          existingUser = _context2.sent;

          if (!existingUser) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "User is already registered"
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(OTP.find({
            email: email
          }).sort({
            createdAt: -1
          }).limit(1));

        case 12:
          recentOtp = _context2.sent;
          console.log(recentOtp);

          if (!(recentOtp.length == 0)) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "otp found"
          }));

        case 18:
          if (!(otp !== recentOtp.otp)) {
            _context2.next = 20;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid otp"
          }));

        case 20:
          _context2.next = 22;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 22:
          hashedPassword = _context2.sent;
          _context2.next = 25;
          return regeneratorRuntime.awrap(User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contactNumber,
            password: hashedPassword,
            accountType: accountType,
            additionalDetails: additionalDetails
          }));

        case 25:
          user = _context2.sent;

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  });
};
//# sourceMappingURL=Auth.dev.js.map
