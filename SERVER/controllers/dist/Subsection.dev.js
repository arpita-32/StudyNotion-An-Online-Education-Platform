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


exports.updateSubSection = function _callee2(req, res) {
  var _req$body2, sectionId, subSectionId, title, description, subSection, video, uploadDetails, updatedSection;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, sectionId = _req$body2.sectionId, subSectionId = _req$body2.subSectionId, title = _req$body2.title, description = _req$body2.description;
          _context2.next = 4;
          return regeneratorRuntime.awrap(SubSection.findById(subSectionId));

        case 4:
          subSection = _context2.sent;

          if (subSection) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "SubSection not found"
          }));

        case 7:
          if (title !== undefined) {
            subSection.title = title;
          }

          if (description !== undefined) {
            subSection.description = description;
          }

          if (!(req.files && req.files.video !== undefined)) {
            _context2.next = 16;
            break;
          }

          video = req.files.video;
          _context2.next = 13;
          return regeneratorRuntime.awrap(uploadImageToCloudinary(video, process.env.FOLDER_NAME));

        case 13:
          uploadDetails = _context2.sent;
          subSection.videoUrl = uploadDetails.secure_url;
          subSection.timeDuration = "".concat(uploadDetails.duration);

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(subSection.save());

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(Section.findById(sectionId).populate("subSection"));

        case 20:
          updatedSection = _context2.sent;
          console.log("updated section", updatedSection);
          return _context2.abrupt("return", res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection
          }));

        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "An error occurred while updating the section"
          }));

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

exports.deleteSubSection = function _callee3(req, res) {
  var _req$body3, subSectionId, sectionId, subSection, updatedSection;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body3 = req.body, subSectionId = _req$body3.subSectionId, sectionId = _req$body3.sectionId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Section.findByIdAndUpdate({
            _id: sectionId
          }, {
            $pull: {
              subSection: subSectionId
            }
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(SubSection.findByIdAndDelete({
            _id: subSectionId
          }));

        case 6:
          subSection = _context3.sent;

          if (subSection) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "SubSection not found"
          }));

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(Section.findById(sectionId).populate("subSection"));

        case 11:
          updatedSection = _context3.sent;
          return _context3.abrupt("return", res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection
          }));

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection"
          }));

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
};
//# sourceMappingURL=Subsection.dev.js.map
