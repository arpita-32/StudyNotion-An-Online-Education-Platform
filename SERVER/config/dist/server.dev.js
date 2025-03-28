"use strict";

var express = require("express");

var Stripe = require("stripe");

var cors = require("cors");

require("dotenv").config();

var app = express();
app.use(express.json());
app.use(cors());
var stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.post("/create-checkout-session", function _callee(req, res) {
  var items, session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          items = req.body.items;

          if (!(!items || !Array.isArray(items) || items.length === 0)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Invalid items array"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: items.map(function (item) {
              return {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: item.name
                  },
                  unit_amount: item.price * 100 // Convert to cents

                },
                quantity: item.quantity
              };
            }),
            success_url: "http://localhost:3000/dashboard/my-profile",
            cancel_url: "http://localhost:3000/cancel"
          }));

        case 6:
          session = _context.sent;
          res.json({
            id: session.id
          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error("Stripe error:", _context.t0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
app.listen(5000, function () {
  return console.log("Server running on port 5000");
});
//# sourceMappingURL=server.dev.js.map
