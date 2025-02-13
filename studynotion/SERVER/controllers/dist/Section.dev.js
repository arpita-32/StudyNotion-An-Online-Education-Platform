"use strict";

var Section = require("../models/Section");

var Course = require("../models/Course");

var SubSection = require("../models/SubSection"); // CREATE a new section


exports.createSection = function _callee(req, res) {
  var _req$body, sectionName, courseId, newSection, updatedCourse;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Extract the required properties from the request body
          _req$body = req.body, sectionName = _req$body.sectionName, courseId = _req$body.courseId; // Validate the input

          if (!(!sectionName || !courseId)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Missing required properties"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Section.create({
            sectionName: sectionName
          }));

        case 6:
          newSection = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate(courseId, {
            $push: {
              courseContent: newSection._id
            }
          }, {
            "new": true
          }).populate({
            path: "courseContent",
            populate: {
              path: "subSection"
            }
          }).exec());

        case 9:
          updatedCourse = _context.sent;
          // Return the updated course object in the response
          res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse: updatedCourse
          });
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          // Handle errors
          res.status(500).json({
            success: false,
            message: "Internal server error",
            error: _context.t0.message
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // UPDATE a section


exports.updateSection = function _callee2(req, res) {
  var _req$body2, sectionName, sectionId, courseId, section, course;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, sectionName = _req$body2.sectionName, sectionId = _req$body2.sectionId, courseId = _req$body2.courseId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Section.findByIdAndUpdate(sectionId, {
            sectionName: sectionName
          }, {
            "new": true
          }));

        case 4:
          section = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
              path: "subSection"
            }
          }).exec());

        case 7:
          course = _context2.sent;
          res.status(200).json({
            success: true,
            message: section,
            data: course
          });
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error("Error updating section:", _context2.t0);
          res.status(500).json({
            success: false,
            message: "Internal server error"
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // DELETE a section


exports.deleteSection = function _callee3(req, res) {
  var _req$body3, sectionId, courseId, section, course;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body3 = req.body, sectionId = _req$body3.sectionId, courseId = _req$body3.courseId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate(courseId, {
            $pull: {
              courseContent: sectionId
            }
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(Section.findById(sectionId));

        case 6:
          section = _context3.sent;
          console.log(sectionId, courseId);

          if (section) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Section not Found"
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(SubSection.deleteMany({
            _id: {
              $in: section.subSection
            }
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(Section.findByIdAndDelete(sectionId));

        case 14:
          _context3.next = 16;
          return regeneratorRuntime.awrap(Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
              path: "subSection"
            }
          }).exec());

        case 16:
          course = _context3.sent;
          res.status(200).json({
            success: true,
            message: "Section deleted",
            data: course
          });
          _context3.next = 24;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);
          console.error("Error deleting section:", _context3.t0);
          res.status(500).json({
            success: false,
            message: "Internal server error"
          });

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 20]]);
};
//# sourceMappingURL=Section.dev.js.map
