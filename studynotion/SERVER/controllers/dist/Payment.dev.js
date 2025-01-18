"use strict";

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key


var Course = require("../models/Course");

var User = require("../models/User");

var mailSender = require("../utils/mailSender");

var _require = require("../mail/courseEnrollmentEmail"),
    courseEnrollmentEmail = _require.courseEnrollmentEmail;

var mongoose = require("mongoose"); // Capture Payment


exports.capturePayment = function _callee(req, res) {
  var course_id, userId, course, uid, amount, currency, paymentIntent;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          course_id = req.body.course_id;
          userId = req.user.id;

          if (course_id) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Please provide a valid course ID"
          }));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(Course.findById(course_id));

        case 7:
          course = _context.sent;

          if (course) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Could not find the course"
          }));

        case 10:
          uid = new mongoose.Types.ObjectId(userId);

          if (!course.studentsEnrolled.includes(uid)) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Student is already enrolled"
          }));

        case 13:
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](4);
          console.error(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Error retrieving course details"
          }));

        case 19:
          amount = course.price * 100; // Stripe processes amounts in cents

          currency = "INR";
          _context.prev = 21;
          _context.next = 24;
          return regeneratorRuntime.awrap(stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            metadata: {
              courseId: course_id,
              userId: userId
            }
          }));

        case 24:
          paymentIntent = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
          }));

        case 28:
          _context.prev = 28;
          _context.t1 = _context["catch"](21);
          console.error(_context.t1);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Could not initiate payment"
          }));

        case 32:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 15], [21, 28]]);
}; // Handle Payment Completion


exports.handlePaymentSuccess = function _callee2(req, res) {
  var _req$body, course_id, user_id, enrolledCourse, enrolledStudent, emailResponse;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, course_id = _req$body.course_id, user_id = _req$body.user_id;

          if (!(!course_id || !user_id)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Course ID and User ID are required"
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate(course_id, {
            $push: {
              studentsEnrolled: user_id
            }
          }, {
            "new": true
          }));

        case 6:
          enrolledCourse = _context2.sent;

          if (enrolledCourse) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "Course not found"
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(user_id, {
            $push: {
              courses: course_id
            }
          }, {
            "new": true
          }));

        case 11:
          enrolledStudent = _context2.sent;

          if (enrolledStudent) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(mailSender(enrolledStudent.email, "Course Enrollment Success", courseEnrollmentEmail(enrolledCourse.courseName)));

        case 16:
          emailResponse = _context2.sent;
          console.log("Email sent: ", emailResponse);
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: "Payment successful and course enrollment updated"
          }));

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](3);
          console.error(_context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "Error processing payment"
          }));

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 21]]);
};
//# sourceMappingURL=Payment.dev.js.map
