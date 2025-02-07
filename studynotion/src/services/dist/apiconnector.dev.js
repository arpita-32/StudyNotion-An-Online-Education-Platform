"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiConnector = exports.axiosInstance = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var axiosInstance = _axios["default"].create({
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

exports.axiosInstance = axiosInstance;

var apiConnector = function apiConnector(method, url, bodyData, headers, params) {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData || null,
    headers: headers || {},
    params: params || null
  });
};

exports.apiConnector = apiConnector;
//# sourceMappingURL=apiconnector.dev.js.map
