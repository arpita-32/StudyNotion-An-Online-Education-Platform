"use strict";

var nodemailer = require("nodemailer");

var mailSender = function mailSender(email, title, body) {
  var transporter, info;
  return regeneratorRuntime.async(function mailSender$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            }
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: "StudyNotion",
            to: "".concat(email),
            subject: "".concat(title),
            html: "".concat(body)
          }));

        case 4:
          info = _context.sent;
          console.log(info);
          return _context.abrupt("return", info);

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0.message);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = mailSender;
//# sourceMappingURL=mailSender.dev.js.map
