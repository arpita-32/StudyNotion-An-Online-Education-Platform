"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setToken = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
};
var authSlice = (0, _toolkit.createSlice)({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken: function setToken(state, value) {
      state.token = value.payload;
    }
  }
});
var setToken = authSlice.actions.setToken;
exports.setToken = setToken;
var _default = authSlice.reducer;
exports["default"] = _default;
//# sourceMappingURL=authSlice.dev.js.map
