"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setTotalItems = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _reactHotToast = require("react-hot-toast");

var initialState = {
  totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0
};
var cartSlice = (0, _toolkit.createSlice)({
  name: "cart",
  initialState: initialState,
  reducers: {
    setTotalItems: function setTotalItems(state, value) {
      state.token = value.payload;
    }
  }
});
var setTotalItems = cartSlice.actions.setTotalItems;
exports.setTotalItems = setTotalItems;
var _default = cartSlice.reducer;
exports["default"] = _default;
//# sourceMappingURL=cartSlice.dev.js.map
