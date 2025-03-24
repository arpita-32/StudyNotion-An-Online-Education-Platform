"use strict";

require('dotenv').config();

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var Course = require("../models/Course");

var User = require("../models/User");

var mailSender = require("../utils/mailSender");

var _require = require("../mail/courseEnrollmentEmail"),
    courseEnrollmentEmail = _require.courseEnrollmentEmail;

var _require2 = require("../mail/paymentSuccessEmail"),
    paymentSuccessEmail = _require2.paymentSuccessEmail;

var CourseProgress = require("../models/CourseProgress"); // Create Stripe checkout session


exports.createCheckoutSession = function _callee(req, res) {
  var _req$body, products, userId, lineItems, session;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, products = _req$body.products, userId = _req$body.userId; // Validate input

          if (!(!products || !userId || !Array.isArray(products))) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid request data"
          }));

        case 4:
          lineItems = products.map(function (product) {
            return {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: product.courseName,
                  metadata: {
                    courseId: product._id
                  }
                },
                unit_amount: Math.round(product.price * 100) // in paise

              },
              quantity: 1
            };
          });
          _context.next = 7;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: "http://localhost:3000/login",
            cancel_url: "http://localhost:3000/error",
            client_reference_id: userId,
            metadata: {
              courseIds: JSON.stringify(products.map(function (p) {
                return p._id;
              }))
            }
          }));

        case 7:
          session = _context.sent;
          return _context.abrupt("return", res.json({
            success: true,
            id: session.id
          }));

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error creating checkout session:', _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: _context.t0.message
          }));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Handle Stripe webhook


exports.handleStripeWebhook = function _callee2(req, res) {
  var sig, event, session, userId, courseIds, user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          sig = req.headers['stripe-signature'];
          _context2.prev = 1;
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
          _context2.next = 9;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](1);
          console.error('Webhook signature verification failed:', _context2.t0);
          return _context2.abrupt("return", res.status(400).send("Webhook Error: ".concat(_context2.t0.message)));

        case 9:
          if (!(event.type === 'checkout.session.completed')) {
            _context2.next = 29;
            break;
          }

          session = event.data.object;
          _context2.prev = 11;
          userId = session.client_reference_id;
          courseIds = JSON.parse(session.metadata.courseIds);
          _context2.next = 16;
          return regeneratorRuntime.awrap(enrollStudents(courseIds, userId, res));

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 18:
          user = _context2.sent;

          if (!user) {
            _context2.next = 22;
            break;
          }

          _context2.next = 22;
          return regeneratorRuntime.awrap(mailSender(user.email, "Payment Received", paymentSuccessEmail("".concat(user.firstName, " ").concat(user.lastName), session.amount_total / 100, session.id, session.payment_intent)));

        case 22:
          return _context2.abrupt("return", res.json({
            received: true
          }));

        case 25:
          _context2.prev = 25;
          _context2.t1 = _context2["catch"](11);
          console.error('Error processing webhook:', _context2.t1);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'Error processing enrollment'
          }));

        case 29:
          return _context2.abrupt("return", res.json({
            received: true
          }));

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 5], [11, 25]]);
}; // Enrollment function


var enrollStudents = function enrollStudents(courseIds, userId, res) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, courseId, enrolledCourse, courseProgress, user;

  return regeneratorRuntime.async(function enrollStudents$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 4;
          _iterator = courseIds[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 28;
            break;
          }

          courseId = _step.value;
          _context3.next = 10;
          return regeneratorRuntime.awrap(Course.findOneAndUpdate({
            _id: courseId
          }, {
            $addToSet: {
              studentsEnrolled: userId
            }
          }, {
            "new": true
          }));

        case 10:
          enrolledCourse = _context3.sent;

          if (enrolledCourse) {
            _context3.next = 14;
            break;
          }

          console.error("Course not found: ".concat(courseId));
          return _context3.abrupt("continue", 25);

        case 14:
          _context3.next = 16;
          return regeneratorRuntime.awrap(CourseProgress.create({
            courseID: courseId,
            userId: userId,
            completedVideos: []
          }));

        case 16:
          courseProgress = _context3.sent;
          _context3.next = 19;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, {
            $addToSet: {
              courses: courseId,
              courseProgress: courseProgress._id
            }
          }));

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 21:
          user = _context3.sent;

          if (!user) {
            _context3.next = 25;
            break;
          }

          _context3.next = 25;
          return regeneratorRuntime.awrap(mailSender(user.email, "Successfully Enrolled into ".concat(enrolledCourse.courseName), courseEnrollmentEmail(enrolledCourse.courseName, "".concat(user.firstName, " ").concat(user.lastName))));

        case 25:
          _iteratorNormalCompletion = true;
          _context3.next = 6;
          break;

        case 28:
          _context3.next = 34;
          break;

        case 30:
          _context3.prev = 30;
          _context3.t0 = _context3["catch"](4);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 34:
          _context3.prev = 34;
          _context3.prev = 35;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 37:
          _context3.prev = 37;

          if (!_didIteratorError) {
            _context3.next = 40;
            break;
          }

          throw _iteratorError;

        case 40:
          return _context3.finish(37);

        case 41:
          return _context3.finish(34);

        case 42:
          _context3.next = 48;
          break;

        case 44:
          _context3.prev = 44;
          _context3.t1 = _context3["catch"](0);
          console.error('Error in enrollment:', _context3.t1);
          throw _context3.t1;

        case 48:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 44], [4, 30, 34, 42], [35,, 37, 41]]);
}; // Send payment success email (for direct API calls)


exports.sendPaymentSuccessEmail = function _callee3(req, res) {
  var _req$body2, orderId, paymentId, amount, userId, user;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, orderId = _req$body2.orderId, paymentId = _req$body2.paymentId, amount = _req$body2.amount, userId = _req$body2.userId;

          if (!(!orderId || !paymentId || !amount || !userId)) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Missing required fields"
          }));

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 6:
          user = _context4.sent;

          if (user) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(mailSender(user.email, "Payment Received", paymentSuccessEmail("".concat(user.firstName, " ").concat(user.lastName), amount, orderId, paymentId)));

        case 11:
          return _context4.abrupt("return", res.json({
            success: true
          }));

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          console.error('Error sending payment email:', _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            success: false,
            message: _context4.t0.message
          }));

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
};
//# sourceMappingURL=Payment.dev.js.map
