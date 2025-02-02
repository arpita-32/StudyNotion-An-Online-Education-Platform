"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setToken = exports.setLoading = exports.setSignupData = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
};
var authSlice = (0, _toolkit.createSlice)({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData: function setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading: function setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken: function setToken(state, value) {
      state.token = value.payload;
    }
  }
});
var _authSlice$actions = authSlice.actions,
    setSignupData = _authSlice$actions.setSignupData,
    setLoading = _authSlice$actions.setLoading,
    setToken = _authSlice$actions.setToken;
exports.setToken = setToken;
exports.setLoading = setLoading;
exports.setSignupData = setSignupData;
var _default = authSlice.reducer;
exports["default"] = _default;
//# sourceMappingURL=authSlice.dev.js.map
