"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactHotToast = _interopRequireDefault(require("react-hot-toast"));

var _apiconnector = require("../apiconnector");

var _api = require("../api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// In Catalog.jsx, modify getCategoryDetails
var getCategoryDetails = function getCategoryDetails() {
  var res;
  return regeneratorRuntime.async(function getCategoryDetails$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Fetching with categoryId:", categoryId);
          _context.next = 4;
          return regeneratorRuntime.awrap(getCatalogPageData(categoryId));

        case 4:
          res = _context.sent;
          console.log("Response:", res);

          if (!(!res || !res.success)) {
            _context.next = 10;
            break;
          }

          console.error("Failed to fetch catalog data:", res); // Set a failure state to exit loading

          setCatalogPageData({
            success: false
          });
          return _context.abrupt("return");

        case 10:
          setCatalogPageData(res);
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching catalog data:", _context.t0); // Set a failure state to exit loading

          setCatalogPageData({
            success: false
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};
//# sourceMappingURL=pageAndComponentData.dev.js.map
