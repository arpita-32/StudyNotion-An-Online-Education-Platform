"use strict";

var _require = require("../config/razorpay"),
    instance = _require.instance;

var Course = require("../models/Course");

var User = require("../models/User");

var mailSender = require("../utils/mailSender");

var _require2 = require("../mail/courseEnrollmentEmail"),
    courseEnrollmentEmail = _require2.courseEnrollmentEmail;

exports.capturePayment = function _callee(req, res) {
  var course_id, userId, course, uid, amount, currency, options, paymentResponse;
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

          return _context.abrupt("return", res.json({
            success: false,
            message: 'Please provide valid course otp'
          }));

        case 4:
          ;
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(Course.findById(course_id));

        case 8:
          course = _context.sent;

          if (course) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.json({
            success: false,
            message: 'could not find the course'
          }));

        case 11:
          ;
          uid = new mongoose.Types.ObjectId(userId);

          if (!course.studentsEnrolled.includes(uid)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            success: false,
            message: 'student is already enrolled'
          }));

        case 15:
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](5);
          console.error(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: _context.t0.message
          }));

        case 21:
          amount = course.price;
          currency = "INR";
          options = {
            amount: amount * 100,
            currency: currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
              courseId: course_id,
              userId: userId
            }
          };
          _context.prev = 24;
          _context.next = 27;
          return regeneratorRuntime.awrap(instance.orders.create(options));

        case 27:
          paymentResponse = _context.sent;
          console.log(paymentResponse);
          return _context.abrupt("return", res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
            message: ''
          }));

        case 32:
          _context.prev = 32;
          _context.t1 = _context["catch"](24);
          console.log(_context.t1);
          res.json({
            success: false,
            message: "could not initiate  order"
          });

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 17], [24, 32]]);
};

exports.verifySignature = function _callee2(req, res) {
  var webhookSecret, signature, shasum, digest, _req$body$payload$pay, courseId, userId, enrolledCourse, enrolledStudent, emailResponse;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          webhookSecret = "12345678";
          signature = req.headers["x-razorpay-signature"];
          shasum = crypto.createHmac("sha256", webhookSecret);
          shasum.update(JSON.stringify(req.body));
          digest = shasum.digest("hex");

          if (!(signature === digest)) {
            _context2.next = 30;
            break;
          }

          console.log("payment is auhorised");
          _req$body$payload$pay = req.body.payload.payment.entity.notes, courseId = _req$body$payload$pay.courseId, userId = _req$body$payload$pay.userId;
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(Course.findOneAndUpdate({
            _id: courseId
          }, {
            $push: {
              studentsEnrolled: userId
            }
          }, {
            "new": true
          }));

        case 11:
          enrolledCourse = _context2.sent;

          if (enrolledCourse) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'course not found'
          }));

        case 14:
          console.log(enrolledCourse);
          _context2.next = 17;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            _id: userId
          }, {
            $push: {
              courses: courseId
            }
          }, {
            "new": true
          }));

        case 17:
          enrolledStudent = _context2.sent;
          console.log(enrolledStudent);
          _context2.next = 21;
          return regeneratorRuntime.awrap(mailSender(enrolledStudent.email, "Congratulaions"));

        case 21:
          emailResponse = _context2.sent;
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: 'signature verified and course added'
          }));

        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](8);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: _context2.t0.message
          }));

        case 28:
          _context2.next = 31;
          break;

        case 30:
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid request'
          }));

        case 31:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 25]]);
};
//# sourceMappingURL=Payment.dev.js.map
