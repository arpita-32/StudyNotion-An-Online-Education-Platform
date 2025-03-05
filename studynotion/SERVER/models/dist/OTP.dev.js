"use strict";

var mongoose = require("mongoose");

var mailSender = require("../utils/mailSender");

var emailTemplate = require("../mail/emailVerificationTemplate");

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
    expires: 60 * 5 // The document will be automatically deleted after 5 minutes of its creation time

  }
}); // Define a function to send emails

function sendVerificationEmail(email, otp) {
  var mailResponse;
  return regeneratorRuntime.async(function sendVerificationEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mailSender(email, "Verification Email", emailTemplate(otp)));

        case 3:
          mailResponse = _context.sent;
          console.log("Email sent successfully: ", mailResponse.response);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("Error occurred while sending email: ", _context.t0);
          throw _context.t0;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
} // Define a post-save hook to send email after the document has been saved


OTPSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("New document saved to database"); // Only send an email when a new document is created

          if (!this.isNew) {
            _context2.next = 4;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(sendVerificationEmail(this.email, this.otp));

        case 4:
          next();

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
});
var OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
//# sourceMappingURL=OTP.dev.js.map
