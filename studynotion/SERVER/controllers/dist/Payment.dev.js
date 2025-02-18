"use strict";

require("dotenv").config();

var Stripe = require("stripe");

var _require = require("../mail/courseEnrollmentEmail"),
    courseEnrollmentEmail = _require.courseEnrollmentEmail;

var Course = require("../models/Course");

var CourseProgress = require("../models/CourseProgress");

var User = require("../models/User");

var _require2 = require("../utils/mailSender"),
    sendEmail = _require2.sendEmail;

var stripe = Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Function to Start Payment

var startPayment = function startPayment(req, res) {
  var _req$body, products, userId, lineItems, session;

  return regeneratorRuntime.async(function startPayment$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, products = _req$body.products, userId = _req$body.userId;

          if (!(!products || products.length === 0)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid product data"
          }));

        case 4:
          lineItems = products.map(function (product) {
            return {
              price_data: {
                currency: "inr",
                product_data: {
                  name: product.courseName
                },
                unit_amount: product.price * 100
              },
              quantity: 1
            };
          });
          _context.next = 7;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            success_url: "https://study-notion-frontend-nine-sable.vercel.app/dashboard/enrolled-courses",
            cancel_url: "https://study-notion-frontend-nine-sable.vercel.app/dashboard/cart",
            metadata: {
              userID: userId,
              courses: JSON.stringify(products.map(function (p) {
                return p.courseId;
              }))
            }
          }));

        case 7:
          session = _context.sent;
          res.json({
            id: session.id
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error in payment session creation:", _context.t0.message);
          res.status(500).json({
            success: false,
            message: _context.t0.message
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // ✅ Function to Handle Stripe Webhooks


var verifySignature = function verifySignature(req, res) {
  var signature, event, session, userID, courses;
  return regeneratorRuntime.async(function verifySignature$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          signature = req.headers["stripe-signature"];
          _context2.prev = 1;
          event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
          _context2.next = 9;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](1);
          console.error("❌ Webhook verification failed:", _context2.t0.message);
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: _context2.t0.message
          }));

        case 9:
          if (!(event.type === "checkout.session.completed")) {
            _context2.next = 15;
            break;
          }

          session = event.data.object;
          userID = session.metadata.userID;
          courses = JSON.parse(session.metadata.courses);
          _context2.next = 15;
          return regeneratorRuntime.awrap(enrollStudent(userID, courses));

        case 15:
          res.status(200).json({
            received: true
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 5]]);
}; // ✅ Function to Enroll Students After Payment


var enrollStudent = function enrollStudent(userID, courses) {
  var user, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, courseId, course, progress;

  return regeneratorRuntime.async(function enrollStudent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findById(userID));

        case 3:
          user = _context3.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 7;
          _iterator = courses[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 29;
            break;
          }

          courseId = _step.value;
          _context3.next = 13;
          return regeneratorRuntime.awrap(Course.findById(courseId));

        case 13:
          course = _context3.sent;

          if (!course.studentsEnrolled.includes(user._id)) {
            _context3.next = 17;
            break;
          }

          console.log("User already enrolled in course: ".concat(courseId));
          return _context3.abrupt("continue", 26);

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate(courseId, {
            $push: {
              studentsEnrolled: userID
            }
          }));

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(CourseProgress.create({
            courseID: courseId,
            userId: userID,
            completedVideos: []
          }));

        case 21:
          progress = _context3.sent;
          _context3.next = 24;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userID, {
            $push: {
              courses: courseId,
              courseProgress: progress._id
            }
          }));

        case 24:
          _context3.next = 26;
          return regeneratorRuntime.awrap(sendEmail(user.email, "Course Enrollment Confirmation", courseEnrollmentEmail(course.courseName, user.firstName)));

        case 26:
          _iteratorNormalCompletion = true;
          _context3.next = 9;
          break;

        case 29:
          _context3.next = 35;
          break;

        case 31:
          _context3.prev = 31;
          _context3.t0 = _context3["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 35:
          _context3.prev = 35;
          _context3.prev = 36;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 38:
          _context3.prev = 38;

          if (!_didIteratorError) {
            _context3.next = 41;
            break;
          }

          throw _iteratorError;

        case 41:
          return _context3.finish(38);

        case 42:
          return _context3.finish(35);

        case 43:
          console.log("✅ Enrollment successful");
          _context3.next = 49;
          break;

        case 46:
          _context3.prev = 46;
          _context3.t1 = _context3["catch"](0);
          console.error("❌ Error enrolling student:", _context3.t1.message);

        case 49:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 46], [7, 31, 35, 43], [36,, 38, 42]]);
}; // ✅ Export Functions (Add this at the bottom!)


module.exports = {
  startPayment: startPayment,
  verifySignature: verifySignature
};
//# sourceMappingURL=Payment.dev.js.map
