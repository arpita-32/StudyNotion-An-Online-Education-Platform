"use strict";

var RatingAndReview = require("../models/RatingAndRaview");

var Course = require("../models/Course");

var _require = require("mongoose"),
    mongoose = _require["default"]; //createRating


exports.createRating = function _callee(req, res) {
  var userId, _req$body, rating, review, courseId, courseDetails, alreadyReviewed, ratingReview, updatedCourseDetails;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //get user id
          userId = req.user.id; //fetchdata from req body

          _req$body = req.body, rating = _req$body.rating, review = _req$body.review, courseId = _req$body.courseId; //check if user is enrolled or not

          _context.next = 5;
          return regeneratorRuntime.awrap(Course.findOne({
            _id: courseId,
            studentsEnrolled: {
              $elemMatch: {
                $eq: userId
              }
            }
          }));

        case 5:
          courseDetails = _context.sent;

          if (courseDetails) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: 'Student is not enrolled in the course'
          }));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(RatingAndReview.findOne({
            user: userId,
            course: courseId
          }));

        case 10:
          alreadyReviewed = _context.sent;

          if (!alreadyReviewed) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(403).json({
            success: false,
            message: 'Course is already reviewed by the user'
          }));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(RatingAndReview.create({
            rating: rating,
            review: review,
            course: courseId,
            user: userId
          }));

        case 15:
          ratingReview = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate({
            _id: courseId
          }, {
            $push: {
              ratingAndReviews: ratingReview._id
            }
          }, {
            "new": true
          }));

        case 18:
          updatedCourseDetails = _context.sent;
          console.log(updatedCourseDetails); //return response

          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
            ratingReview: ratingReview
          }));

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: _context.t0.message
          }));

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; //getAverageRating


exports.getAverageRating = function _callee2(req, res) {
  var courseId, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          //get course ID
          courseId = req.body.courseId; //calculate avg rating

          _context2.next = 4;
          return regeneratorRuntime.awrap(RatingAndReview.aggregate([{
            $match: {
              course: new mongoose.Types.ObjectId(courseId)
            }
          }, {
            $group: {
              _id: null,
              averageRating: {
                $avg: "$rating"
              }
            }
          }]));

        case 4:
          result = _context2.sent;

          if (!(result.length > 0)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(200).json({
            success: true,
            averageRating: result[0].averageRating
          }));

        case 7:
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: 'Average Rating is 0, no ratings given till now',
            averageRating: 0
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: _context2.t0.message
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; //getAllRatingAndReviews


exports.getAllRating = function _callee3(req, res) {
  var allReviews;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(RatingAndReview.find({}).sort({
            rating: "desc"
          }).populate({
            path: "user",
            select: "firstName lastName email image"
          }).populate({
            path: "course",
            select: "courseName"
          }).exec());

        case 3:
          allReviews = _context3.sent;
          return _context3.abrupt("return", res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews
          }));

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: _context3.t0.message
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
//# sourceMappingURL=RatingAndReview.dev.js.map
