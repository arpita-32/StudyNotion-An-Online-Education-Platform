"use strict";

var User = require("../models/User");

var mailSender = require("../utils/mailSender");

var bcrypt = require("bcryptjs");

var crypto = require("crypto");

exports.resetPasswordToken = function _callee(req, res) {
  var email, user, token, updatedDetails, url;
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
          user = _context.sent;

          if (user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.json({
            success: false,
            message: "This Email: ".concat(email, " is not Registered With Us Enter a Valid Email ")
          }));

        case 7:
          token = crypto.randomBytes(20).toString("hex");
          _context.next = 10;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: email
          }, {
            token: token,
            resetPasswordExpires: Date.now() + 3600000
          }, {
            "new": true
          }));

        case 10:
          updatedDetails = _context.sent;
          console.log("DETAILS", updatedDetails);
          url = "http://localhost:3000/update-password/".concat(token);
          _context.next = 15;
          return regeneratorRuntime.awrap(mailSender(email, "Password Reset", "Your Link for email verification is ".concat(url, ". Please click this url to reset your password.")));

        case 15:
          res.json({
            success: true,
            message: "Email Sent Successfully, Please Check Your Email to Continue Further"
          });
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.json({
            error: _context.t0.message,
            success: false,
            message: "Some Error in Sending the Reset Message"
          }));

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.resetPassword = function _callee2(req, res) {
  var _req$body, password, confirmPassword, token, userDetails, encryptedPassword;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, password = _req$body.password, confirmPassword = _req$body.confirmPassword, token = _req$body.token;

          if (!(confirmPassword !== password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.json({
            success: false,
            message: "Password and Confirm Password Does not Match"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            token: token
          }));

        case 6:
          userDetails = _context2.sent;

          if (userDetails) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.json({
            success: false,
            message: "Token is Invalid"
          }));

        case 9:
          if (userDetails.resetPasswordExpires > Date.now()) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            success: false,
            message: "Token is Expired, Please Regenerate Your Token"
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 13:
          encryptedPassword = _context2.sent;
          _context2.next = 16;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            token: token
          }, {
            password: encryptedPassword
          }, {
            "new": true
          }));

        case 16:
          res.json({
            success: true,
            message: "Password Reset Successful"
          });
          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.json({
            error: _context2.t0.message,
            success: false,
            message: "Some Error in Updating the Password"
          }));

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
};
//# sourceMappingURL=ResetPassword.dev.js.map
