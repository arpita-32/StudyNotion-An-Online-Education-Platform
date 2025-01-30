"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiConnector = exports.axiosInstance = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var axiosInstance = _axios["default"].create({});

exports.axiosInstance = axiosInstance;

var apiConnector = function apiConnector(method, url, bodyData, headers, params) {
  return axiosInstance({
    method: "".concat(method),
    url: "".concat(url),
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null
  });
};

exports.apiConnector = apiConnector;
//# sourceMappingURL=apiconnector.dev.js.map
