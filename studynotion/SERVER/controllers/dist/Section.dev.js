"use strict";

var Section = require("../models/Section");

var Course = require("../models/Course");

exports.createSection = function _callee(req, res) {
  var _req$body, _sectionName, courseId, newSection, updateCourseDetails;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, _sectionName = _req$body.sectionName, courseId = _req$body.courseId;

          if (!(!_sectionName || !courseId)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Missing properties'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Section.create({
            sectionName: _sectionName
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
          }));

        case 9:
          updateCourseDetails = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: 'Section creates successfully',
            updateCourseDetails: updateCourseDetails
          }));

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'unable to create section please try again'
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.updateSection = function _callee2(req, res) {
  var _req$body2, _sectionName2, sectionId, section;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, _sectionName2 = _req$body2.sectionName, sectionId = _req$body2.sectionId;

          if (!(!_sectionName2 || !sectionId)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Missing properties'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(Section.findByIdAndUpdate(sectionId, {
            sectionName: _sectionName2
          }, {
            "new": true
          }));

        case 6:
          section = _context2.sent;
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: 'Section updated successfully'
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'unable to update section please try again'
          }));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.deleteSection = function _callee3(req, res) {
  var sectionId;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          sectionId = req.params.sectionId;

          if (!(!sectionName || !sectionId)) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: 'Missing properties'
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(Section.findByIdAndDelete(sectionId));

        case 6:
          return _context3.abrupt("return", res.status(200).json({
            success: true,
            message: 'Section delete successfully'
          }));

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: 'unable to delete section please try again'
          }));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};
//# sourceMappingURL=Section.dev.js.map
