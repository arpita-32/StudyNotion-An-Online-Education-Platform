"use strict";

var mongoose = require("mongoose");

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
    "default": Date.now(),
    expires: 5 * 60
  }
});

function sendVerificationEmail(email, otp) {
  var mailResponse;
  return regeneratorRuntime.async(function sendVerificationEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mailSender(email, "Verification Email from StudyNotion", otp));

        case 3:
          mailResponse = _context.sent;
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.log("error occured while sending mails:", _context.t0);
          throw _context.t0;

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

OTPSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(sendVerificationEmail(this.email, this.otp));

        case 2:
          next();

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
});
module.exports = mongoose.model("OTP", OTPSchema);
//# sourceMappingURL=OTP.dev.js.map
