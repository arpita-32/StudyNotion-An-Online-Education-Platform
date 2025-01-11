"use strict";

var Profile = require("../models/Profile");

var User = require("../models/User");

exports.updateProfile = function _callee(req, res) {
  var _req$body, _req$body$dateOfBirth, dateOfBirth, _req$body$about, about, contactNumber, gender, id, userDetails, profileId, profileDetails;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, _req$body$dateOfBirth = _req$body.dateOfBirth, dateOfBirth = _req$body$dateOfBirth === void 0 ? "" : _req$body$dateOfBirth, _req$body$about = _req$body.about, about = _req$body$about === void 0 ? "" : _req$body$about, contactNumber = _req$body.contactNumber, gender = _req$body.gender;
          id = req.user.id;

          if (!(!contactNumber || !gender || !id)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'All fields are required'
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findById(id));

        case 7:
          userDetails = _context.sent;
          profileId = userDetails.additionalDetails;
          _context.next = 11;
          return regeneratorRuntime.awrap(Profile.findById(profileId));

        case 11:
          profileDetails = _context.sent;
          profileDetails.dateOfBirth = dateOfBirth;
          profileDetails.about = about;
          profileDetails.gender = gender;
          profileDetails.contactNumber = contactNumber;
          _context.next = 18;
          return regeneratorRuntime.awrap(profileDetails.save());

        case 18:
          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: 'profile updated successfully',
            profileDetails: profileDetails
          }));

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            error: _context.t0.message
          }));

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

exports.deleteAccount = function _callee2(req, res) {
  var id, userDetails;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.user.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findById(id));

        case 4:
          userDetails = _context2.sent;

          if (userDetails) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: 'user not found'
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(Profile.findByIdAndDelete({
            _id: userDetails.additionalDetails
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(User.findByIdAndDelete({
            _id: id
          }));

        case 11:
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            updatedSection: updatedSection
          }));

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'user cannot be deleted'
          }));

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.getAllUserDetails = function _callee3(req, res) {
  var id, userDetails;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.user.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findById(id).populate("additionalDeails").exec());

        case 4:
          userDetails = _context3.sent;
          return _context3.abrupt("return", res.status(200).json({
            success: true,
            message: 'User data fetched successfully'
          }));

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: _context3.t0.message
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};
//# sourceMappingURL=Profile.dev.js.map
