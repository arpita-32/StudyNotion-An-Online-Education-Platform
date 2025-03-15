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
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.catalogData.CATALOGPAGEDATA_API, {
            categoryId: categoryId
          }));

        case 4:
          response = _context.sent;
          console.log('response from the category page detail api:- ', response);

          if (response.data.success) {
            _context.next = 8;
            break;
          }

          throw new Error(response.data.message);

        case 8:
          return _context.abrupt("return", response.data.data);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          console.log('error occured while getting category page details : - (for detail error see the network tab in console)', _context.t0.message);
          console.error(_context.t0.message);

        case 15:
          _context.prev = 15;

          _reactHotToast["default"].dismiss(toastId);

          return _context.finish(15);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11, 15, 18]]);
};

exports.getCatalogData = getCatalogData;
//# sourceMappingURL=pageAndComponentData.dev.js.map
