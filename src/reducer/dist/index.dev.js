"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _authSlice = _interopRequireDefault(require("../slices/authSlice"));

var _profileSlice = _interopRequireDefault(require("../slices/profileSlice"));

var _cartSlice = _interopRequireDefault(require("../slices/cartSlice"));

var _courseSlice = _interopRequireDefault(require("../slices/courseSlice"));

var _viewCourseSlice = _interopRequireDefault(require("../slices/viewCourseSlice"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var rootReducer = (0, _toolkit.combineReducers)({
  auth: _authSlice["default"],
  cart: _cartSlice["default"],
  course: _courseSlice["default"],
  profile: _profileSlice["default"],
  viewCourse: _viewCourseSlice["default"]
});
var _default = rootReducer;
exports["default"] = _default;
//# sourceMappingURL=index.dev.js.map
