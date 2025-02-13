"use strict";

// Import necessary modules
var Section = require("../models/Section");

var SubSection = require("../models/SubSection");

var _require = require("../utils/imageUploader"),
    uploadImageToCloudinary = _require.uploadImageToCloudinary; // Create a new sub-section for a given section


exports.createSubSection = function _callee(req, res) {
  var _req$body, sectionId, title, description, video, uploadDetails, SubSectionDetails, updatedSection;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Extract necessary information from the request body
          _req$body = req.body, sectionId = _req$body.sectionId, title = _req$body.title, description = _req$body.description;
          video = req.files.video; // Check if all necessary fields are provided

          if (!(!sectionId || !title || !description || !video)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "All Fields are Required"
          }));

        case 5:
          console.log(video); // Upload the video file to Cloudinary

          _context.next = 8;
          return regeneratorRuntime.awrap(uploadImageToCloudinary(video, process.env.FOLDER_NAME));

        case 8:
          uploadDetails = _context.sent;
          console.log(uploadDetails); // Create a new sub-section with the necessary information

          _context.next = 12;
          return regeneratorRuntime.awrap(SubSection.create({
            title: title,
            timeDuration: "".concat(uploadDetails.duration),
            description: description,
            videoUrl: uploadDetails.secure_url
          }));

        case 12:
          SubSectionDetails = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(Section.findByIdAndUpdate({
            _id: sectionId
          }, {
            $push: {
              subSection: SubSectionDetails._id
            }
          }, {
            "new": true
          }).populate("subSection"));

        case 15:
          updatedSection = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            data: updatedSection
          }));

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          // Handle any errors that may occur during the process
          console.error("Error creating new sub-section:", _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Internal server error",
            error: _context.t0.message
          }));

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

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
