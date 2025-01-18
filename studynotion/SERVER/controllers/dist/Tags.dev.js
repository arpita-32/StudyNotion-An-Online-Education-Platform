"use strict";

var Tag = require("../models/tags");

exports.createTag = function _callee(req, res) {
  var _req$body, name, description, tagDetails;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, description = _req$body.description;

          if (!(!name || !description)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'All fields are required'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Tag.create({
            name: name,
            description: description
          }));

        case 6:
          tagDetails = _context.sent;
          console.log(tagDetails);
          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: 'Tag created successfully'
          }));

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: _context.t0.message
          }));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.showAlltags = function _callee2(req, res) {
  var allTags;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Tag.find({}, {
            name: true,
            description: true
          }));

        case 3:
          allTags = _context2.sent;
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: 'All tags returned successfully',
            allTags: allTags
          }));

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: _context2.t0.message
          }));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
//# sourceMappingURL=Tags.dev.js.map
