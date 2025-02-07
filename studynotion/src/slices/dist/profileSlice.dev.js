"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setLoading = exports.setUser = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  loading: false
};
var profileSlice = (0, _toolkit.createSlice)({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser: function setUser(state, value) {
      state.user = value.payload;
    },
    setLoading: function setLoading(state, value) {
      state.loading = value.payload;
    }
  }
});
var _profileSlice$actions = profileSlice.actions,
    setUser = _profileSlice$actions.setUser,
    setLoading = _profileSlice$actions.setLoading;
exports.setLoading = setLoading;
exports.setUser = setUser;
var _default = profileSlice.reducer;
exports["default"] = _default;
//# sourceMappingURL=profileSlice.dev.js.map
