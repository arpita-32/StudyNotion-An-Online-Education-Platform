"use strict";

require('dotenv').config();

var jwt = require('jsonwebtoken'); // Auth middleware


exports.auth = function _callee(req, resp, next) {
  var authHeader, token, decoded;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Extract token from request
          authHeader = req.header('Authorization');
          token = req.cookies.mycookie || req.body.token || authHeader && authHeader.replace('Bearer ', '');

          if (token) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", resp.status(401).json({
            success: false,
            message: 'Authorization failed: No token provided'
          }));

        case 5:
          _context.prev = 5;
          // Verify token
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
          next();
          _context.next = 16;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](5);

          if (!(_context.t0.name === 'TokenExpiredError')) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", resp.status(401).json({
            success: false,
            message: 'Token expired'
          }));

        case 15:
          return _context.abrupt("return", resp.status(401).json({
            success: false,
            message: 'Invalid token'
          }));

        case 16:
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t1 = _context["catch"](0);
          console.error('Auth Middleware Error:', _context.t1);
          return _context.abrupt("return", resp.status(500).json({
            success: false,
            message: 'Internal server error'
          }));

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18], [5, 11]]);
}; // isStudent middleware


exports.isStudent = function _callee2(req, resp, next) {
  var accountType;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          accountType = req.user.accountType;

          if (!(accountType !== 'Student')) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", resp.status(403).json({
            success: false,
            message: 'Access denied: Student access required'
          }));

        case 4:
          next();
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error('isStudent Middleware Error:', _context2.t0);
          return _context2.abrupt("return", resp.status(500).json({
            success: false,
            message: 'Internal server error'
          }));

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // isInstructor middleware


exports.isInstructor = function _callee3(req, resp, next) {
  var accountType;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          accountType = req.user.accountType;

          if (!(accountType !== 'Instructor')) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", resp.status(403).json({
            success: false,
            message: 'Access denied: Instructor access required'
          }));

        case 4:
          next();
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error('isInstructor Middleware Error:', _context3.t0);
          return _context3.abrupt("return", resp.status(500).json({
            success: false,
            message: 'Internal server error'
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // isAdmin middleware


exports.isAdmin = function _callee4(req, resp, next) {
  var accountType;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          accountType = req.user.accountType;

          if (!(accountType !== 'Admin')) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", resp.status(403).json({
            success: false,
            message: 'Access denied: Admin access required'
          }));

        case 4:
          next();
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error('isAdmin Middleware Error:', _context4.t0);
          return _context4.abrupt("return", resp.status(500).json({
            success: false,
            message: 'Internal server error'
          }));

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
//# sourceMappingURL=auth.dev.js.map
