"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setLoading = exports.setUser = void 0;

var _toolkit = require("@reduxjs/toolkit");

var initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "null") : null,
  loading: false
};
var profileSlice = (0, _toolkit.createSlice)({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser: function setUser(state, action) {
      state.user = action.payload;
    },
    setLoading: function setLoading(state, action) {
      state.loading = action.payload;
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
