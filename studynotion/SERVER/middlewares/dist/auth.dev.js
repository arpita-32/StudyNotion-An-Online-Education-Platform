"use strict";

// Importing required modules
var jwt = require("jsonwebtoken");

var dotenv = require("dotenv");

var User = require("../models/User"); // Configuring dotenv to load environment variables from .env file


dotenv.config(); // This function is used as middleware to authenticate user requests

exports.auth = function _callee(req, res, next) {
  var token, decode;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Extracting JWT from request cookies, body or header
          token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", ""); // If JWT is missing, return 401 Unauthorized response

          if (token) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: "Token Missing"
          }));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(jwt.verify(token, process.env.JWT_SECRET));

        case 7:
          decode = _context.sent;
          console.log(decode); // Storing the decoded JWT payload in the request object for further use

          req.user = decode;
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](4);
          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: "token is invalid"
          }));

        case 15:
          // If JWT is valid, move on to the next middleware or request handler
          next();
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t1 = _context["catch"](0);
          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: "Something Went Wrong While Validating the Token"
          }));

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18], [4, 12]]);
};

exports.isStudent = function _callee2(req, res, next) {
  var userDetails;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 3:
          userDetails = _context2.sent;

          if (!(userDetails.accountType !== "Student")) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            success: false,
            message: "This is a Protected Route for Students"
          }));

        case 6:
          next();
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "User Role Can't be Verified"
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.isAdmin = function _callee3(req, res, next) {
  var userDetails;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 3:
          userDetails = _context3.sent;

          if (!(userDetails.accountType !== "Admin")) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(401).json({
            success: false,
            message: "This is a Protected Route for Admin"
          }));

        case 6:
          next();
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: "User Role Can't be Verified"
          }));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.isInstructor = function _callee4(req, res, next) {
  var userDetails;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 3:
          userDetails = _context4.sent;
          console.log(userDetails);
          console.log(userDetails.accountType);

          if (!(userDetails.accountType !== "Instructor")) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            success: false,
            message: "This is a Protected Route for Instructor"
          }));

        case 8:
          next();
          _context4.next = 14;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).json({
            success: false,
            message: "User Role Can't be Verified"
          }));

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
};
//# sourceMappingURL=auth.dev.js.map
