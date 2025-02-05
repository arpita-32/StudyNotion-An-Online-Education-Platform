"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiConnector = exports.axiosInstance = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var axiosInstance = _axios["default"].create({
  baseURL: "http://localhost:4000/api/v1",
  // Set a base URL for all requests
  headers: {
    "Content-Type": "application/json" // Default headers

  }
});

exports.axiosInstance = axiosInstance;

var apiConnector = function apiConnector(method, url, bodyData, headers, params) {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: headers ? _objectSpread({}, axiosInstance.defaults.headers, {}, headers) : axiosInstance.defaults.headers,
    params: params ? params : null
  });
};

exports.apiConnector = apiConnector;
//# sourceMappingURL=apiconnector.dev.js.map
