"use strict";

require('dotenv').config();

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var Course = require("../models/Course");

var crypto = require("crypto");

var User = require("../models/User");

var mailSender = require("../utils/mailSender");

var mongoose = require("mongoose");

var _require = require("../mail/courseEnrollmentEmail"),
    courseEnrollmentEmail = _require.courseEnrollmentEmail;

var _require2 = require("../mail/paymentSuccessEmail"),
    paymentSuccessEmail = _require2.paymentSuccessEmail;

var CourseProgress = require("../models/CourseProgress");

var userID, courses;

exports.startPayment = function _callee(req, resp) {
  var products, userId, lineItem, session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          products = req.body.products;
          courses = products;
          userId = req.body.userId;
          userID = userId;
          lineItem = products.map(function (product) {
            return {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: product.courseName
                },
                unit_amount: product.price * 100
              },
              quantity: 1
            };
          });
          console.log("Generated Line Items:", lineItem);
          _context.next = 9;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: lineItem,
            success_url: "http://localhost:3000/login",
            cancel_url: "http://localhost:3000/error"
          }));

        case 9:
          session = _context.sent;
          resp.json({
            id: session.id
          });
          _context.next = 18;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log('error occured  while starting payment:- ', _context.t0.message);
          console.error(_context.t0.message);
          return _context.abrupt("return", resp.status(500).json({
            success: false,
            message: _context.t0.message
          }));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.verifySignature = function _callee2(req, resp) {
  var signature, event;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          signature = req.headers['stripe-signature'];
          _context2.prev = 1;
          event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
          _context2.next = 10;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](1);
          console.log('error occured while verifying signature:- ', _context2.t0.message);
          console.error(_context2.t0.message);
          return _context2.abrupt("return", resp.status(500).json({
            success: false,
            message: _context2.t0.message
          }));

        case 10:
          if (!(event.type === 'payment_intent.succeeded')) {
            _context2.next = 16;
            break;
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(enrollStudents(userID, courses, resp));

        case 13:
          resp.json({
            recieved: true
          });
          _context2.next = 18;
          break;

        case 16:
          console.log('unhandled event type');
          return _context2.abrupt("return", resp.status(400).json({
            success: false,
            message: 'Unhandled event type'
          }));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 5]]);
};

exports.sendPaymentSuccessEmail = function _callee3(req, res) {
  var _req$body, orderId, paymentId, amount, userId, enrolledStudent;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, orderId = _req$body.orderId, paymentId = _req$body.paymentId, amount = _req$body.amount;
          userId = req.user.id;

          if (!(!orderId || !paymentId || !amount || !userId)) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Please provide all the details"
          }));

        case 4:
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 7:
          enrolledStudent = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(mailSender(enrolledStudent.email, "Payment Received", paymentSuccessEmail("".concat(enrolledStudent.firstName, " ").concat(enrolledStudent.lastName), amount / 100, orderId, paymentId)));

        case 10:
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](4);
          console.log("error in sending mail", _context3.t0);
          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Could not send email"
          }));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 12]]);
};

var enrollStudents = function enrollStudents(courses, userId, res) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, courseId, enrolledCourse, courseProgress, enrolledStudent, emailResponse;

  return regeneratorRuntime.async(function enrollStudents$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!courses || !userId)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Please Provide Course ID and User ID"
          }));

        case 2:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 5;
          _iterator = courses[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context4.next = 36;
            break;
          }

          courseId = _step.value;
          _context4.prev = 9;
          _context4.next = 12;
          return regeneratorRuntime.awrap(Course.findOneAndUpdate({
            _id: courseId
          }, {
            $push: {
              studentsEnrolled: userId
            }
          }, {
            "new": true
          }));

        case 12:
          enrolledCourse = _context4.sent;

          if (enrolledCourse) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(500).json({
            success: false,
            error: "Course not found"
          }));

        case 15:
          console.log("Updated course: ", enrolledCourse);
          _context4.next = 18;
          return regeneratorRuntime.awrap(CourseProgress.create({
            courseID: courseId,
            userId: userId,
            completedVideos: []
          }));

        case 18:
          courseProgress = _context4.sent;
          _context4.next = 21;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id
            }
          }, {
            "new": true
          }));

        case 21:
          enrolledStudent = _context4.sent;
          console.log("Enrolled student: ", enrolledStudent); // Send an email notification to the enrolled student

          _context4.next = 25;
          return regeneratorRuntime.awrap(mailSender(enrolledStudent.email, "Successfully Enrolled into ".concat(enrolledCourse.courseName), courseEnrollmentEmail(enrolledCourse.courseName, "".concat(enrolledStudent.firstName, " ").concat(enrolledStudent.lastName))));

        case 25:
          emailResponse = _context4.sent;
          console.log("Email sent successfully: ", emailResponse.response);
          _context4.next = 33;
          break;

        case 29:
          _context4.prev = 29;
          _context4.t0 = _context4["catch"](9);
          console.log(_context4.t0);
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            error: _context4.t0.message
          }));

        case 33:
          _iteratorNormalCompletion = true;
          _context4.next = 7;
          break;

        case 36:
          _context4.next = 42;
          break;

        case 38:
          _context4.prev = 38;
          _context4.t1 = _context4["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context4.t1;

        case 42:
          _context4.prev = 42;
          _context4.prev = 43;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 45:
          _context4.prev = 45;

          if (!_didIteratorError) {
            _context4.next = 48;
            break;
          }

          throw _iteratorError;

        case 48:
          return _context4.finish(45);

        case 49:
          return _context4.finish(42);

        case 50:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 38, 42, 50], [9, 29], [43,, 45, 49]]);
};
//# sourceMappingURL=Payment.dev.js.map
