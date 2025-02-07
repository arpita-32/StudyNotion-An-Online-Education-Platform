"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDisplayPicture = updateDisplayPicture;
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.deleteProfile = deleteProfile;

var _reactHotToast = require("react-hot-toast");

var _profileSlice = require("../../slices/profileSlice");

var _apiconnector = require("../apiconnector");

var _api = require("../api");

var _authAPI = require("./authAPI");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UPDATE_DISPLAY_PICTURE_API = _api.settingsEndpoints.UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API = _api.settingsEndpoints.UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API = _api.settingsEndpoints.CHANGE_PASSWORD_API,
    DELETE_PROFILE_API = _api.settingsEndpoints.DELETE_PROFILE_API;

function updateDisplayPicture(token, formData) {
  return function _callee(dispatch) {
    var toastId, response;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            toastId = _reactHotToast.toast.loading("Loading...");
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("PUT", UPDATE_DISPLAY_PICTURE_API, formData, {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer ".concat(token)
            }));

          case 4:
            response = _context.sent;
            console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", response);

            if (response.data.success) {
              _context.next = 8;
              break;
            }

            throw new Error(response.data.message);

          case 8:
            _reactHotToast.toast.success("Display Picture Updated Successfully");

            dispatch((0, _profileSlice.setUser)(response.data.data));
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", _context.t0);

            _reactHotToast.toast.error("Could Not Update Display Picture");

          case 16:
            _reactHotToast.toast.dismiss(toastId);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 12]]);
  };
}

function updateProfile(token, formData) {
  return function _callee2(dispatch) {
    var toastId, response, userImage;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            toastId = _reactHotToast.toast.loading("Loading...");
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("PUT", UPDATE_PROFILE_API, formData, {
              Authorization: "Bearer ".concat(token)
            }));

          case 4:
            response = _context2.sent;
            console.log("UPDATE_PROFILE_API API RESPONSE............", response);

            if (response.data.success) {
              _context2.next = 8;
              break;
            }

            throw new Error(response.data.message);

          case 8:
            userImage = response.data.updatedUserDetails.image ? response.data.updatedUserDetails.image : "https://api.dicebear.com/5.x/initials/svg?seed=".concat(response.data.updatedUserDetails.firstName, " ").concat(response.data.updatedUserDetails.lastName);
            dispatch((0, _profileSlice.setUser)(_objectSpread({}, response.data.updatedUserDetails, {
              image: userImage
            })));

            _reactHotToast.toast.success("Profile Updated Successfully");

            _context2.next = 17;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](1);
            console.log("UPDATE_PROFILE_API API ERROR............", _context2.t0);

            _reactHotToast.toast.error("Could Not Update Profile");

          case 17:
            _reactHotToast.toast.dismiss(toastId);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 13]]);
  };
}

function changePassword(token, formData) {
  var toastId, response;
  return regeneratorRuntime.async(function changePassword$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          toastId = _reactHotToast.toast.loading("Loading...");
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("POST", CHANGE_PASSWORD_API, formData, {
            Authorization: "Bearer ".concat(token)
          }));

        case 4:
          response = _context3.sent;
          console.log("CHANGE_PASSWORD_API API RESPONSE............", response);

          if (response.data.success) {
            _context3.next = 8;
            break;
          }

          throw new Error(response.data.message);

        case 8:
          _reactHotToast.toast.success("Password Changed Successfully");

          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](1);
          console.log("CHANGE_PASSWORD_API API ERROR............", _context3.t0);

          _reactHotToast.toast.error(_context3.t0.response.data.message);

        case 15:
          _reactHotToast.toast.dismiss(toastId);

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 11]]);
}

function deleteProfile(token, navigate) {
  return function _callee3(dispatch) {
    var toastId, response;
    return regeneratorRuntime.async(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            toastId = _reactHotToast.toast.loading("Loading...");
            _context4.prev = 1;
            _context4.next = 4;
            return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("DELETE", DELETE_PROFILE_API, null, {
              Authorization: "Bearer ".concat(token)
            }));

          case 4:
            response = _context4.sent;
            console.log("DELETE_PROFILE_API API RESPONSE............", response);

            if (response.data.success) {
              _context4.next = 8;
              break;
            }

            throw new Error(response.data.message);

          case 8:
            _reactHotToast.toast.success("Profile Deleted Successfully");

            dispatch((0, _authAPI.logout)(navigate));
            _context4.next = 16;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](1);
            console.log("DELETE_PROFILE_API API ERROR............", _context4.t0);

            _reactHotToast.toast.error("Could Not Delete Profile");

          case 16:
            _reactHotToast.toast.dismiss(toastId);

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[1, 12]]);
  };
}
//# sourceMappingURL=SettingsAPI.dev.js.map
