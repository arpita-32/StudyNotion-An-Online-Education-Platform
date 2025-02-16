"use strict";

require('dotenv').config();

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var _require = require('../mail/courseEnrollmentEmail'),
    courseEnrollmentEmail = _require.courseEnrollmentEmail;

var Course = require('../models/Course');

var CourseProgress = require('../models/CourseProgress');

var User = require('../models/User');

var _require2 = require('../utils/mailSender'),
    sendEmail = _require2.sendEmail;

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
          _context.next = 8;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: lineItem,
            success_url: 'https://study-notion-frontend-nine-sable.vercel.app/dashboard/enrolled-courses',
            cancel_url: 'https://study-notion-frontend-nine-sable.vercel.app/dashboard/cart'
          }));

        case 8:
          session = _context.sent;
          resp.json({
            id: session.id
          });
          _context.next = 17;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.log('error occured  while starting payment:- ', _context.t0.message);
          console.error(_context.t0.message);
          return _context.abrupt("return", resp.status(500).json({
            success: false,
            message: _context.t0.message
          }));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
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
          return regeneratorRuntime.awrap(enrollStudent(userID, courses, resp));

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

var enrollStudent = function enrollStudent(userID, courses, resp) {
  var user;
  return regeneratorRuntime.async(function enrollStudent$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('userId is: -', userID);
          console.log('courses are: -', courses);
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(User.findById(userID));

        case 5:
          user = _context4.sent;
          courses.forEach(function _callee3(course) {
            var updatedCourse, Progress, updatedUser, mailresponse;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!course.studentsEnrolled.includes(user._id)) {
                      _context3.next = 5;
                      break;
                    }

                    console.log("user is already enrolled in the course having coourseId : - ".concat(course._id));
                    return _context3.abrupt("return");

                  case 5:
                    _context3.next = 7;
                    return regeneratorRuntime.awrap(Course.findByIdAndUpdate(course._id, {
                      $push: {
                        studentsEnrolled: userID
                      }
                    }, {
                      "new": true
                    }));

                  case 7:
                    updatedCourse = _context3.sent;

                    if (!updatedCourse) {
                      console.log('course not found');
                    }

                    console.log('updated course after enrolling looks like:- ', updatedCourse);
                    _context3.next = 12;
                    return regeneratorRuntime.awrap(CourseProgress.create({
                      courseID: updatedCourse._id,
                      userId: userID,
                      completedVideos: []
                    }));

                  case 12:
                    Progress = _context3.sent;
                    _context3.next = 15;
                    return regeneratorRuntime.awrap(User.findByIdAndUpdate(userID, {
                      $push: {
                        courses: course._id,
                        courseProgress: Progress._id
                      }
                    }, {
                      "new": true
                    }));

                  case 15:
                    updatedUser = _context3.sent;
                    console.log("Enrolled student: ", updatedUser); //sending mail to the user

                    _context3.next = 19;
                    return regeneratorRuntime.awrap(sendEmail(updatedUser.email, 'Course Enrollment Confirmation', courseEnrollmentEmail(course.courseName, updatedUser.firstName)));

                  case 19:
                    mailresponse = _context3.sent;

                    if (!mailresponse) {
                      console.log('mail couldnot be sent');
                    }

                  case 21:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](2);
          console.log('error occured while enrolling student in courses:- ', _context4.t0.message);
          console.error(_context4.t0.message);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 9]]);
};
//# sourceMappingURL=Payment.dev.js.map
