"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProfilePicture = updateProfilePicture;
exports.getUserEnrolledCourses = getUserEnrolledCourses;
exports.getInstructorData = exports.deleteProfile = exports.updateProfile = void 0;

var _reactHotToast = require("react-hot-toast");

var _profileSlice = require("../../slices/profileSlice");

var _apiconnector = require("../apiconnector");

var _authSlice = require("../../slices/authSlice");

var _api = require("../api");

var _authAPI = require("./authAPI");

function updateProfilePicture(token, formData) {
  return function _callee(dispatch) {
    var toastId, response;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            toastId = _reactHotToast.toast.loading('Loading...');
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("PUT", _api.profileEndpoints.UPDATE_DISPLAY_PICTURE, formData, {
              "Content-Type": "multipart/form-data",
              "Authorization": "Bearer ".concat(token) // Pass token in the Authorization header

            }));

          case 4:
            response = _context.sent;
            console.log('response', response);

            if (response.data.success) {
              _context.next = 9;
              break;
            }

            _reactHotToast.toast.error('Error in uploading profile picture');

            throw new Error(response.data.message);

          case 9:
            console.log('New user details after updating the profile pic which will be set to user slice and  localstorage :', response.data.data);
            dispatch((0, _profileSlice.setUser)(response.data.data));
            localStorage.setItem('user', JSON.stringify(response.data.data));

            _reactHotToast.toast.dismiss(toastId);

            _reactHotToast.toast.success('Profile picture updated successfully');

            _context.next = 21;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](1);
            console.log('Error occurred while calling the backend for profile picture updation:', _context.t0.message);
            console.error(_context.t0.message);

            _reactHotToast.toast.dismiss(toastId);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 16]]);
  };
}

var updateProfile = function updateProfile(token, data) {
  return function _callee2(dispatch) {
    var toastId, response;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            toastId = _reactHotToast.toast.loading('Updating Profile');
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('PUT', _api.profileEndpoints.UPDATE_PROFILE, data, //passing header which is generally in json format
            {
              "Content-Type": "multipart/form-data",
              "Authorization": "Bearer ".concat(token) // Pass token in the Authorization header

            }));

          case 4:
            response = _context2.sent;

            if (response.data.success) {
              _context2.next = 9;
              break;
            }

            _reactHotToast.toast.dismiss(toastId);

            _reactHotToast.toast.error('error updating profile');

            throw new Error(response.data.message);

          case 9:
            //else
            console.log('updated user details after updating profile:- ', response.data.updatedUserDetails);
            dispatch((0, _profileSlice.setUser)(response.data.updatedUserDetails));
            localStorage.setItem('user', JSON.stringify(response.data.updatedUserDetails));

            _reactHotToast.toast.dismiss(toastId);

            _reactHotToast.toast.success('profile updated');

            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](1);
            console.log('error occured while updating profile', _context2.t0.message);
            console.error(_context2.t0.message);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 16]]);
  };
}; //function for deleting the profile


exports.updateProfile = updateProfile;

var deleteProfile = function deleteProfile(token, navigate) {
  return function _callee3(dispatch) {
    var toastId, response;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            toastId = _reactHotToast.toast.loading('Deleting Account');
            _context3.prev = 1;
            _context3.next = 4;
            return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('DELETE', _api.profileEndpoints.DELETE_ACCOUNT, //empty body
            {}, //header having token
            {
              "Content-Type": "multipart/form-data",
              "Authorization": "Bearer ".concat(token)
            }));

          case 4:
            response = _context3.sent;

            if (response.data.success) {
              _context3.next = 7;
              break;
            }

            throw new Error(response.data.message);

          case 7:
            dispatch((0, _profileSlice.setUser)(null));
            dispatch((0, _authSlice.setToken)(null));
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');

            _reactHotToast.toast.dismiss(toastId);

            _reactHotToast.toast.success('Profile deleted successfully');

            _context3.next = 22;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](1);

            _reactHotToast.toast.dismiss(toastId);

            _reactHotToast.toast.error('error deleting profile');

            console.log('error occurred while deleting profile', _context3.t0.message);
            console.error(_context3.t0.message);

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[1, 16]]);
  };
};

exports.deleteProfile = deleteProfile;

function getUserEnrolledCourses(token) {
  var toastId, result, response;
  return regeneratorRuntime.async(function getUserEnrolledCourses$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          toastId = _reactHotToast.toast.loading("Loading...");
          result = [];
          _context4.prev = 2;

          if (token) {
            _context4.next = 5;
            break;
          }

          throw new Error("No token provided");

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)("GET", _api.profileEndpoints.GET_ENROLLED_COURSES, null, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 7:
          response = _context4.sent;

          if (response.data.success) {
            _context4.next = 10;
            break;
          }

          throw new Error(response.data.message);

        case 10:
          result = response.data.data;
          _context4.next = 20;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](2);
          console.log("GET_USER_ENROLLED_COURSES_API ERROR:", _context4.t0);

          if (!isTokenExpired(_context4.t0)) {
            _context4.next = 19;
            break;
          }

          _reactHotToast.toast.error("Session expired. Please login again"); // Dispatch logout action or redirect to login


          return _context4.abrupt("return", null);

        case 19:
          _reactHotToast.toast.error(_context4.t0.message || "Could Not Get Enrolled Courses");

        case 20:
          _context4.prev = 20;

          _reactHotToast.toast.dismiss(toastId);

          return _context4.finish(20);

        case 23:
          return _context4.abrupt("return", result);

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 13, 20, 23]]);
}

var getInstructorData = function getInstructorData(token) {
  var response;
  return regeneratorRuntime.async(function getInstructorData$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('GET', _api.profileEndpoints.INSTRUCTOR_DASHBOARD, null, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context5.sent;

          if (response.data.success) {
            _context5.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          console.log('data from instructor dashboard api:- ', response.data);
          return _context5.abrupt("return", response.data);

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.log('GET_INSTRUCTOR_DATA ERROR:- ', _context5.t0.message);

          _reactHotToast.toast.error('Failed to fetch instructor data');

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getInstructorData = getInstructorData;
//# sourceMappingURL=profileAPI.dev.js.map
