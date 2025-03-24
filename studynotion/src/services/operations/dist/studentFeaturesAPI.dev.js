"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buyCourse = buyCourse;
exports.handleStripePaymentSuccess = handleStripePaymentSuccess;

var _reactHotToast = require("react-hot-toast");

var _api = require("../api");

var _apiconnector = require("../apiconnector");

var _courseSlice = require("../../slices/courseSlice");

var _cartSlice = require("../../slices/cartSlice");

var _stripeJs = require("@stripe/stripe-js");

var COURSE_PAYMENT_API = _api.studentEndpoints.COURSE_PAYMENT_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API = _api.studentEndpoints.SEND_PAYMENT_SUCCESS_EMAIL_API;

function buyCourse(token, courses, userDetails, navigate, dispatch) {
  var toastId, stripe, sessionResponse, result;
  return regeneratorRuntime.async(function buyCourse$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          toastId = _reactHotToast.toast.loading("Loading...");
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _stripeJs.loadStripe)(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY));

        case 4:
          stripe = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("POST", COURSE_PAYMENT_API, {
            products: courses,
            userId: userDetails._id
          }, {
            Authorization: "Bearer ".concat(token)
          }));

        case 7:
          sessionResponse = _context.sent;

          if (sessionResponse.data.success) {
            _context.next = 10;
            break;
          }

          throw new Error(sessionResponse.data.message);

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(stripe.redirectToCheckout({
            sessionId: sessionResponse.data.id
          }));

        case 12:
          result = _context.sent;

          if (!result.error) {
            _context.next = 15;
            break;
          }

          throw new Error(result.error.message);

        case 15:
          // If we get here, the redirect was successful
          // The actual verification will happen via webhook
          _reactHotToast.toast.success("Redirecting to payment...");

          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](1);
          console.log("PAYMENT API ERROR.....", _context.t0);

          _reactHotToast.toast.error(_context.t0.message || "Could not initiate payment");

        case 22:
          _reactHotToast.toast.dismiss(toastId);

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 18]]);
}

function sendPaymentSuccessEmail(response, amount, token) {
  return regeneratorRuntime.async(function sendPaymentSuccessEmail$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.orderId,
            paymentId: response.paymentId,
            amount: amount
          }, {
            Authorization: "Bearer ".concat(token)
          }));

        case 3:
          _context2.next = 8;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](0);
          console.log("PAYMENT SUCCESS EMAIL ERROR....", _context2.t0);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 5]]);
} // This function will be called from the webhook handler in your backend


function handleStripePaymentSuccess(paymentData, token, navigate, dispatch) {
  var toastId, response;
  return regeneratorRuntime.async(function handleStripePaymentSuccess$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          toastId = _reactHotToast.toast.loading("Processing payment...");
          dispatch((0, _courseSlice.setPaymentLoading)(true));
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("POST", "/payment/verify-stripe", paymentData, {
            Authorization: "Bearer ".concat(token)
          }));

        case 5:
          response = _context3.sent;

          if (response.data.success) {
            _context3.next = 8;
            break;
          }

          throw new Error(response.data.message);

        case 8:
          _reactHotToast.toast.success("Payment Successful, you are added to the course");

          navigate("/dashboard/enrolled-courses");
          dispatch((0, _cartSlice.resetCart)());
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](2);
          console.log("PAYMENT VERIFY ERROR....", _context3.t0);

          _reactHotToast.toast.error("Could not verify Payment");

        case 17:
          _reactHotToast.toast.dismiss(toastId);

          dispatch((0, _courseSlice.setPaymentLoading)(false));

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 13]]);
}
//# sourceMappingURL=StudentFeaturesAPI.dev.js.map
