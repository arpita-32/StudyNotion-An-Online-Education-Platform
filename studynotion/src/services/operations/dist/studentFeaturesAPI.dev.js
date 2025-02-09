"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buyCourse = buyCourse;

var _reactHotToast = require("react-hot-toast");

var _api = require("../api");

var _apiconnector = require("../apiconnector");

var _rzp_logo = _interopRequireDefault(require("../../assets/Logo/rzp_logo.png"));

var _courseSlice = require("../../slices/courseSlice");

var _cartSlice = require("../../slices/cartSlice");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var COURSE_PAYMENT_API = _api.studentEndpoints.COURSE_PAYMENT_API,
    COURSE_VERIFY_API = _api.studentEndpoints.COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API = _api.studentEndpoints.SEND_PAYMENT_SUCCESS_EMAIL_API;

function loadScript(src) {
  return new Promise(function (resolve) {
    var script = document.createElement("script");
    script.src = src;

    script.onload = function () {
      resolve(true);
    };

    script.onerror = function () {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

function buyCourse(token, courses, userDetails, navigate, dispatch) {
  var toastId, res, orderResponse, options, paymentObject;
  return regeneratorRuntime.async(function buyCourse$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          toastId = _reactHotToast.toast.loading("Loading...");
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(loadScript("https://checkout.razorpay.com/v1/checkout.js"));

        case 4:
          res = _context.sent;

          if (res) {
            _context.next = 8;
            break;
          }

          _reactHotToast.toast.error("RazorPay SDK failed to load");

          return _context.abrupt("return");

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("POST", COURSE_PAYMENT_API, {
            courses: courses
          }, {
            Authorization: "Bearer ".concat(token)
          }));

        case 10:
          orderResponse = _context.sent;

          if (orderResponse.data.success) {
            _context.next = 13;
            break;
          }

          throw new Error(orderResponse.data.message);

        case 13:
          console.log("PRINTING orderResponse", orderResponse); //options

          options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: "".concat(orderResponse.data.message.amount),
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank You for Purchasing the Course",
            image: _rzp_logo["default"],
            prefill: {
              name: "".concat(userDetails.firstName),
              email: userDetails.email
            },
            handler: function handler(response) {
              //send successful wala mail
              sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token); //verifyPayment

              verifyPayment(_objectSpread({}, response, {
                courses: courses
              }), token, navigate, dispatch);
            }
          }; //miss hogya tha 

          paymentObject = new window.Razorpay(options);
          paymentObject.open();
          paymentObject.on("payment.failed", function (response) {
            _reactHotToast.toast.error("oops, payment failed");

            console.log(response.error);
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](1);
          console.log("PAYMENT API ERROR.....", _context.t0);

          _reactHotToast.toast.error("Could not make Payment");

        case 24:
          _reactHotToast.toast.dismiss(toastId);

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 20]]);
}

function sendPaymentSuccessEmail(response, amount, token) {
  return regeneratorRuntime.async(function sendPaymentSuccessEmail$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
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
} //verify payment


function verifyPayment(bodyData, token, navigate, dispatch) {
  var toastId, response;
  return regeneratorRuntime.async(function verifyPayment$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          toastId = _reactHotToast.toast.loading("Verifying Payment....");
          dispatch((0, _courseSlice.setPaymentLoading)(true));
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("POST", COURSE_VERIFY_API, bodyData, {
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
          _reactHotToast.toast.success("payment Successful, ypou are addded to the course");

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
//# sourceMappingURL=studentFeaturesAPI.dev.js.map
