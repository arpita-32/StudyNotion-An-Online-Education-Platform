"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.resetCourseState = exports.setPaymentLoading = exports.setEditCourse = exports.setCourse = exports.setStep = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false
};
var courseSlice = (0, _toolkit.createSlice)({
  name: "course",
  initialState: initialState,
  reducers: {
    setStep: function setStep(state, action) {
      state.step = action.payload;
    },
    setCourse: function setCourse(state, action) {
      state.course = action.payload;
    },
    setEditCourse: function setEditCourse(state, action) {
      state.editCourse = action.payload;
    },
    setPaymentLoading: function setPaymentLoading(state, action) {
      state.paymentLoading = action.payload;
    },
    resetCourseState: function resetCourseState(state) {
      state.step = 1;
      state.course = null;
      state.editCourse = false;
    }
  }
});
var _courseSlice$actions = courseSlice.actions,
    setStep = _courseSlice$actions.setStep,
    setCourse = _courseSlice$actions.setCourse,
    setEditCourse = _courseSlice$actions.setEditCourse,
    setPaymentLoading = _courseSlice$actions.setPaymentLoading,
    resetCourseState = _courseSlice$actions.resetCourseState;
exports.resetCourseState = resetCourseState;
exports.setPaymentLoading = setPaymentLoading;
exports.setEditCourse = setEditCourse;
exports.setCourse = setCourse;
exports.setStep = setStep;
var _default = courseSlice.reducer;
exports["default"] = _default;
//# sourceMappingURL=courseSlice.dev.js.map
