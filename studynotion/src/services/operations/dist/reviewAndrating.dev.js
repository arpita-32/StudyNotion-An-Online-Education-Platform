"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllReviews = void 0;

var _reactHotToast = _interopRequireDefault(require("react-hot-toast"));

var _apiconnector = require("../apiconnector");

var _api = require("../api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getAllReviews = function getAllReviews() {
  var response;
  return regeneratorRuntime.async(function getAllReviews$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('GET', _api.ratingsEndpoints.REVIEWS_DETAILS_API));

        case 3:
          response = _context.sent;

          if (response.data.success) {
            _context.next = 7;
            break;
          }

          _reactHotToast["default"].error('review can not be fetched for review slider');

          throw new Error(response.data.message);

        case 7:
          return _context.abrupt("return", response.data.data);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.log('error occured while fetching all reviews...');
          console.error(_context.t0.message);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getAllReviews = getAllReviews;
//# sourceMappingURL=reviewAndrating.dev.js.map
