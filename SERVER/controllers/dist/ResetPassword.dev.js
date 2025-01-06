"use strict";

var User = require("../models/User");

var mailSender = require("../utils/mailSender");

var bcrypt = require("bcrypt");

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
            success: fals,
            message: 'your email is not registered with us'
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
          return regeneratorRuntime.awrap(mailSender(email, "Password reset link", "Password reset link:".concat(url)));

        case 14:
          return _context.abrupt("return", res.json({
            success: true,
            message: 'email sent successfully,please check email and change pwd'
          }));

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'something went wrong while reset'
          }));

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

exports.resetPassword = function _callee2(req, res) {
  var _req$body, password, confirmPassword, token, hashedPassword;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, password = _req$body.password, confirmPassword = _req$body.confirmPassword, token = _req$body.token;

          if (!(password != confirmPassword)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.json({
            success: false,
            message: 'password not matching'
          }));

        case 4:
          if (userDetails) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.json({
            success: false,
            message: 'Token is invalid'
          }));

        case 6:
          if (!(userDetails.resetPasswordExpires < Date.now())) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.json({
            success: false,
            message: 'token is expired ,please regenerate your token'
          }));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 10:
          hashedPassword = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            token: token
          }, {
            password: hashedPassword
          }, {
            "new": true
          }));

        case 13:
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: 'password reset successfully'
          }));

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'something went wrong'
          }));

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
};
//# sourceMappingURL=ResetPassword.dev.js.map
