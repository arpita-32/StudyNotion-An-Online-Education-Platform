"use strict";

var SubSection = require("../models/SubSection");

var Section = require("../models/Section");

var _require = require("../utils/imageUploader"),
    uploadImageToCloudinary = _require.uploadImageToCloudinary;

exports.createSubSection = function _callee(req, res) {
  var _req$body, sectionId, title, timeDuration, description, video, uploadDetails, subSectionDetails, updatedSection;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, sectionId = _req$body.sectionId, title = _req$body.title, timeDuration = _req$body.timeDuration, description = _req$body.description;
          video = req.files.videoFile;

          if (!(!sectionId || !title || !timeDuration || !video)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'All fields are required'
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(uploadImageToCloudinary(video, process.env.FOLDER_NAME));

        case 7:
          uploadDetails = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
          }));

        case 10:
          subSectionDetails = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(Section.findByIdAndUpdate({
            _id: sectionId
          }, {
            $push: {
              subSection: SubSectionDetails._id
            }
          }, {
            "new": true
          }));

        case 13:
          updatedSection = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: 'sub Section created successfully',
            updatedSection: updatedSection
          }));

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: _context.t0.message
          }));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
}; //update and delete section
//# sourceMappingURL=Subsection.dev.js.map
