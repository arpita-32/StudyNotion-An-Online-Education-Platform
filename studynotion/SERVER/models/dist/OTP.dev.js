"use strict";

var mongoose = require("mongoose");

var mailSender = require('../utils/mailSender');

var OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now,
    expires: 5 * 60 // Document will be automatically deleted after 5 minutes

  }
}); // Function to send verification email

function sendVerificationEmail(email, otp) {
  var mailResponse;
  return regeneratorRuntime.async(function sendVerificationEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mailSender(email, "Verification Email from StudyNotion", "<h1>Please verify your email</h1>\n            <p>Your OTP for verification is: ".concat(otp, "</p>\n            <p>This OTP is valid for 5 minutes</p>")));

        case 3:
          mailResponse = _context.sent;
          return _context.abrupt("return", mailResponse);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("Error occurred while sending verification email:", _context.t0);
          throw _context.t0;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
} // Pre-save middleware to send OTP email


OTPSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(sendVerificationEmail(this.email, this.otp));

        case 3:
          next();
          _context2.next = 9;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this, [[0, 6]]);
});
module.exports = mongoose.model("OTP", OTPSchema);
//# sourceMappingURL=OTP.dev.js.map
