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
}; // Example usage with authentication token


exports.apiConnector = apiConnector;
var token = localStorage.getItem('token'); // Assuming you store the token in localStorage

var headers = {
  'Authorization': "Bearer ".concat(token),
  'Content-Type': 'application/json'
};
apiConnector('POST', 'http://localhost:4000/api/v1/auth/sendotp', {
  email: 'user@example.com'
}, headers).then(function (response) {
  console.log('OTP sent successfully:', response.data);
})["catch"](function (error) {
  console.error('Error sending OTP:', error);
});
//# sourceMappingURL=apiconnector.dev.js.map
