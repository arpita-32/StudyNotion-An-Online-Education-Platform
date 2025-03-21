"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCatalogData = void 0;

var _apiconnector = require("../apiconnector");

var _api = require("../api");

var _reactHotToast = _interopRequireDefault(require("react-hot-toast"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getCatalogData = function getCatalogData(categoryId) {
  var toastId, response;
  return regeneratorRuntime.async(function getCatalogData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          toastId = _reactHotToast["default"].loading('Loading...');
          _context.prev = 1;

          if (categoryId) {
            _context.next = 5;
            break;
          }

          _reactHotToast["default"].error("Category ID is required");

          return _context.abrupt("return", null);

        case 5:
          console.log("Fetching catalog data for category ID:", categoryId);
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.catalogData.CATALOGPAGEDATA_API, {
            categoryId: categoryId
          }));

        case 8:
          response = _context.sent;
          console.log('API Response Status:', response.status); // Check if the response contains data

          if (!(!response || !response.data)) {
            _context.next = 12;
            break;
          }

          throw new Error("Empty response received from the server");

        case 12:
          console.log('Response from the category page detail API:', response.data);

          if (response.data.success) {
            _context.next = 15;
            break;
          }

          throw new Error(response.data.message || "Failed to fetch catalog data");

        case 15:
          return _context.abrupt("return", response.data.data);

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](1);
          console.error("Error in getCatalogData function:", _context.t0); // More detailed error logging

          if (_context.t0.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Server responded with error:", _context.t0.response.status);
            console.error("Error data:", _context.t0.response.data);

            _reactHotToast["default"].error(_context.t0.response.data.message || "Server error occurred");
          } else if (_context.t0.request) {
            // The request was made but no response was received
            console.error("No response received from server");

            _reactHotToast["default"].error("No response from server. Please check your connection.");
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", _context.t0.message);

            _reactHotToast["default"].error("Error setting up request: " + _context.t0.message);
          }

          return _context.abrupt("return", null);

        case 23:
          _context.prev = 23;

          _reactHotToast["default"].dismiss(toastId);

          return _context.finish(23);

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 18, 23, 26]]);
};

exports.getCatalogData = getCatalogData;
//# sourceMappingURL=pageAndComponentData.dev.js.map
