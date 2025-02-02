"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.resetCart = exports.removeFromCart = exports.addToCart = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _reactHotToast = require("react-hot-toast");

var initialState = {
  cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
  total: localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0,
  totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0
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
        // If the course is already in the cart, do not modify the quantity
        _reactHotToast.toast.error("Course already in cart");

        return;
      } // If the course is not in the cart, add it to the cart


      state.cart.push(course); // Update the total quantity and price

      state.totalItems++;
      state.total += course.price; // Update to localstorage

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems)); // show toast

      _reactHotToast.toast.success("Course added to cart");
    },
    removeFromCart: function removeFromCart(state, action) {
      var courseId = action.payload;
      var index = state.cart.findIndex(function (item) {
        return item._id === courseId;
      });

      if (index >= 0) {
        // If the course is found in the cart, remove it
        state.totalItems--;
        state.total -= state.cart[index].price;
        state.cart.splice(index, 1); // Update to localstorage

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems)); // show toast

        _reactHotToast.toast.success("Course removed from cart");
      }
    },
    resetCart: function resetCart(state) {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0; // Update to localstorage

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
