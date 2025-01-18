"use strict";

var Course = require("../models/Course");

var Tag = require("../models/tags");

var User = require("../models/User");

var _require = require("../utils/imageUploader"),
    uploadImageToCloudinary = _require.uploadImageToCloudinary;

exports.createCourse = function _callee(req, res) {
  var _req$body, courseName, courseDescription, whatYouWillLearn, price, tag, thumbnail, userId, instructorDetails, tagDetails, thumbnailImage, newCourse;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, courseName = _req$body.courseName, courseDescription = _req$body.courseDescription, whatYouWillLearn = _req$body.whatYouWillLearn, price = _req$body.price, tag = _req$body.tag;
          thumbnail = req.files.thumbnailImage;

          if (!(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'All fields are required'
          }));

        case 5:
          userId = req.user.id;
          _context.next = 8;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 8:
          instructorDetails = _context.sent;
          console.log("Instructor Details:", instructorDetails);

          if (instructorDetails) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: 'Instructor Details not found'
          }));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(Tag.findById(tag));

        case 14:
          tagDetails = _context.sent;

          if (tagDetails) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Tags Details not found'
          }));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME));

        case 19:
          thumbnailImage = _context.sent;
          _context.next = 22;
          return regeneratorRuntime.awrap(Course.create({
            courseName: courseName,
            courseDescription: courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price: price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
          }));

        case 22:
          newCourse = _context.sent;
          _context.next = 25;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate);

        case 25:
          _context.next = 29;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};
//# sourceMappingURL=Course.dev.js.map
