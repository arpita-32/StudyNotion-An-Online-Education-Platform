"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setToken = exports.setLoading = exports.setSignupData = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") || "null") : null
};
var authSlice = (0, _toolkit.createSlice)({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData: function setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading: function setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken: function setToken(state, action) {
      state.token = action.payload;
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
