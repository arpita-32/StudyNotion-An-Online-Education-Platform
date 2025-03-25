"use strict";

var mongoose = require("mongoose");

var Section = require("../models/Section");

var SubSection = require("../models/SubSection");

var CourseProgress = require("../models/CourseProgress");

var Course = require("../models/Course");

exports.updateCourseProgress = function _callee(req, res) {
  var _req$body, courseId, subsectionId, userId, subsection, courseProgress;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, courseId = _req$body.courseId, subsectionId = _req$body.subsectionId;
          userId = req.user.id;
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(SubSection.findById(subsectionId));

        case 5:
          subsection = _context.sent;

          if (subsection) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Invalid subsection"
          }));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(CourseProgress.findOne({
            courseID: courseId,
            userId: userId
          }));

        case 10:
          courseProgress = _context.sent;

          if (courseProgress) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Course progress Does Not Exist"
          }));

        case 15:
          if (!courseProgress.completedVideos.includes(subsectionId)) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Subsection already completed"
          }));

        case 17:
          // Push the subsection into the completedVideos array
          courseProgress.completedVideos.push(subsectionId);

        case 18:
          _context.next = 20;
          return regeneratorRuntime.awrap(courseProgress.save());

        case 20:
          return _context.abrupt("return", res.status(200).json({
            message: "Course progress updated"
          }));

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](2);
          console.error(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            error: "Internal server error"
          }));

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 23]]);
}; // exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id
//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }
//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()
//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })
//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100
//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier
//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }
//# sourceMappingURL=courseProgress.dev.js.map
