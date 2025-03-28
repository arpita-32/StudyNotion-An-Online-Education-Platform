"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.updateCompletedLectures = exports.setCompletedLectures = exports.setTotalNoOfLectures = exports.setEntireCourseData = exports.setCourseSectionData = void 0;

var _toolkit = require("@reduxjs/toolkit");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var initialState = {
  courseSectionData: [],
  courseEntireData: [],
  completedLectures: [],
  totalNoOfLectures: 0
};
var viewCourseSlice = (0, _toolkit.createSlice)({
  name: "viewCourse",
  initialState: initialState,
  reducers: {
    setCourseSectionData: function setCourseSectionData(state, action) {
      state.courseSectionData = action.payload;
    },
    setEntireCourseData: function setEntireCourseData(state, action) {
      state.courseEntireData = action.payload;
    },
    setTotalNoOfLectures: function setTotalNoOfLectures(state, action) {
      state.totalNoOfLectures = action.payload;
    },
    setCompletedLectures: function setCompletedLectures(state, action) {
      state.completedLectures = action.payload;
    },
    updateCompletedLectures: function updateCompletedLectures(state, action) {
      state.completedLectures = [].concat(_toConsumableArray(state.completedLectures), [action.payload]);
    }
  }
});
var _viewCourseSlice$acti = viewCourseSlice.actions,
    setCourseSectionData = _viewCourseSlice$acti.setCourseSectionData,
    setEntireCourseData = _viewCourseSlice$acti.setEntireCourseData,
    setTotalNoOfLectures = _viewCourseSlice$acti.setTotalNoOfLectures,
    setCompletedLectures = _viewCourseSlice$acti.setCompletedLectures,
    updateCompletedLectures = _viewCourseSlice$acti.updateCompletedLectures;
exports.updateCompletedLectures = updateCompletedLectures;
exports.setCompletedLectures = setCompletedLectures;
exports.setTotalNoOfLectures = setTotalNoOfLectures;
exports.setEntireCourseData = setEntireCourseData;
exports.setCourseSectionData = setCourseSectionData;
var _default = viewCourseSlice.reducer;
exports["default"] = _default;
//# sourceMappingURL=viewCourseSlice.dev.js.map
