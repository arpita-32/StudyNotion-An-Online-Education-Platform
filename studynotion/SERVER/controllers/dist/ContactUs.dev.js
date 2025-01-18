"use strict";

var _require = require("../mail/contactFormRes"),
    contactUsEmail = _require.contactUsEmail;

var mailSender = require("../utils/mailSender");

exports.contactUsController = function _callee(req, res) {
  var _req$body, email, firstname, lastname, message, phoneNo, countrycode, emailRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, firstname = _req$body.firstname, lastname = _req$body.lastname, message = _req$body.message, phoneNo = _req$body.phoneNo, countrycode = _req$body.countrycode;
          console.log(req.body);
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(mailSender(email, "Your Data send successfully", contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)));

        case 5:
          emailRes = _context.sent;
          console.log("Email Res ", emailRes);
          return _context.abrupt("return", res.json({
            success: true,
            message: "Email send successfully"
          }));

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](2);
          console.log("Error", _context.t0);
          console.log("Error message :", _context.t0.message);
          return _context.abrupt("return", res.json({
            success: false,
            message: "Something went wrong..."
          }));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 10]]);
};
//# sourceMappingURL=ContactUs.dev.js.map
