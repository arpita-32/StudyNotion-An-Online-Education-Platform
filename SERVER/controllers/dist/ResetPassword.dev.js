"use strict";

var User = require("../models/User");

var mailSender = require("../utils/mailSender");

var bcrypt = require("bcrypt");

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

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: 'Your email is not registered with us'
          }));

        case 7:
          token = crypto.randomUUID();
          _context.next = 10;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: email
          }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
          }, {
            "new": true
          }));

        case 10:
          updatedDetails = _context.sent;
          url = "http://localhost:3000/update-password/".concat(token);
          _context.next = 14;
          return regeneratorRuntime.awrap(mailSender(email, "Password Reset Link", "Password Reset Link: ".concat(url)));

        case 14:
          return _context.abrupt("return", res.json({
            success: true,
            message: 'Email sent successfully, please check email and change password'
          }));

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'Something went wrong while sending reset email'
          }));

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

exports.resetPassword = function _callee2(req, res) {
  var _req$body, password, confirmPassword, token, userDetails, hashedPassword;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, password = _req$body.password, confirmPassword = _req$body.confirmPassword, token = _req$body.token;

          if (!(password !== confirmPassword)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Passwords do not match'
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

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: 'Token is invalid'
          }));

        case 9:
          if (!(userDetails.resetPasswordExpires < Date.now())) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Token has expired, please regenerate your token'
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 13:
          hashedPassword = _context2.sent;
          _context2.next = 16;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            token: token
          }, {
            password: hashedPassword,
            token: null,
            resetPasswordExpires: null
          }, {
            "new": true
          }));

        case 16:
          return _context2.abrupt("return", res.json({
            success: true,
            message: 'Password reset successfully'
          }));

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'Something went wrong while resetting password'
          }));

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
};
//# sourceMappingURL=ResetPassword.dev.js.map
