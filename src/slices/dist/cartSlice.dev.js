"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.resetCart = exports.removeFromCart = exports.addToCart = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _reactHotToast = require("react-hot-toast");

var initialState = {
  cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart") || "[]") : [],
  total: localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total") || "0") : 0,
  totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems") || "0") : 0
};
var cartSlice = (0, _toolkit.createSlice)({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart: function addToCart(state, action) {
      var course = action.payload;
      var index = state.cart.findIndex(function (item) {
        return item._id === course._id;
      });

      if (index >= 0) {
        _reactHotToast.toast.error("Course already in cart");

        return;
      }

      state.cart.push(course);
      state.totalItems++;
      state.total += course.price;
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      _reactHotToast.toast.success("Course added to cart");
    },
    removeFromCart: function removeFromCart(state, action) {
      var courseId = action.payload;
      var index = state.cart.findIndex(function (item) {
        return item._id === courseId;
      });

      if (index >= 0) {
        state.totalItems--;
        state.total -= state.cart[index].price;
        state.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        _reactHotToast.toast.success("Course removed from cart");
      }
    },
    resetCart: function resetCart(state) {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    }
  }
});
var _cartSlice$actions = cartSlice.actions,
    addToCart = _cartSlice$actions.addToCart,
    removeFromCart = _cartSlice$actions.removeFromCart,
    resetCart = _cartSlice$actions.resetCart;
exports.resetCart = resetCart;
exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;
var _default = cartSlice.reducer;
exports["default"] = _default;
//# sourceMappingURL=cartSlice.dev.js.map
