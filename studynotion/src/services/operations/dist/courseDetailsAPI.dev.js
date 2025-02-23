"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markLectureAsComplete = exports.saveReview = exports.updateSubsection = exports.createSubSection = exports.deleteSubsection = exports.deleteSection = exports.updateSection = exports.createSection = exports.getFullDetailsOfCourse = exports.getCourseDetails = exports.editCourseDetails = exports.createCourse = exports.getAllCategories = exports.deleteCourse = exports.getAllCoursesOfInstructor = void 0;

var _apiconnector = require("../apiconnector");

var _api = require("../api");

var _reactHotToast = _interopRequireDefault(require("react-hot-toast"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getAllCoursesOfInstructor = function getAllCoursesOfInstructor(token) {
  var response;
  return regeneratorRuntime.async(function getAllCoursesOfInstructor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('GET', _api.courseEndpoints.GET_ALL_INSTRUCTOR_COURSES_API, null, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context.sent;

          if (response.data.success) {
            _context.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          console.log("data from the instructor courses", response.data.data);
          return _context.abrupt("return", response.data.data);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);

          _reactHotToast["default"].error('Failed to fetch courses of instructor');

          console.log('error occured while fetching courses of instructor:- ', _context.t0.message);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getAllCoursesOfInstructor = getAllCoursesOfInstructor;

var deleteCourse = function deleteCourse(courseId, token) {
  var response;
  return regeneratorRuntime.async(function deleteCourse$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('DELETE', _api.courseEndpoints.DELETE_COURSE_API, {
            courseId: courseId
          }, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context2.sent;

          if (response.data.success) {
            _context2.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          _reactHotToast["default"].success('Course deleted successfully');

          _context2.next = 14;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);

          _reactHotToast["default"].error('Failed to delete course');

          console.log('error occured while deleting course:- ', _context2.t0.message);
          console.error(_context2.t0.message);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.deleteCourse = deleteCourse;

var getAllCategories = function getAllCategories(token) {
  var response;
  return regeneratorRuntime.async(function getAllCategories$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('GET', _api.courseEndpoints.COURSE_CATEGORIES_API, null, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context3.sent;

          if (response.data.success) {
            _context3.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          return _context3.abrupt("return", response.data.data);

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);

          _reactHotToast["default"].error('Failed to fetch categories');

          console.log('error occured while fetching categories:- ', _context3.t0.message);
          console.error(_context3.t0.message);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getAllCategories = getAllCategories;

var createCourse = function createCourse(token, formData) {
  var response;
  return regeneratorRuntime.async(function createCourse$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.CREATE_COURSE_API, formData, {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context4.sent;
          console.log('response form service layer:- ', response);

          if (response.data.success) {
            _context4.next = 7;
            break;
          }

          throw new Error(response.data.message);

        case 7:
          _reactHotToast["default"].success('Course details added successfully');

          console.log("data from the create course", response.data.data);
          return _context4.abrupt("return", response.data.data);

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);

          _reactHotToast["default"].error('Failed to create course');

          console.log('error occured while creating course:- ', _context4.t0.message);
          console.error(_context4.t0.message);

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.createCourse = createCourse;

var editCourseDetails = function editCourseDetails(formData, token) {
  var response;
  return regeneratorRuntime.async(function editCourseDetails$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.EDIT_COURSE_API, formData, {
            'Content-Type': 'multipart/form-data',
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
          _reactHotToast["default"].success('Course details updated successfully');

          console.log("data from the edit course details", response.data.data);
          return _context5.abrupt("return", response.data.data);

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.log('error occured while editing course details: ', _context5.t0.message);
          console.error(_context5.t0.message);

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.editCourseDetails = editCourseDetails;

var getCourseDetails = function getCourseDetails(courseId) {
  var response;
  return regeneratorRuntime.async(function getCourseDetails$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.COURSE_DETAILS_API, {
            courseId: courseId
          }));

        case 3:
          response = _context6.sent;
          console.log('response is: - ', response);

          if (response.data.success) {
            _context6.next = 7;
            break;
          }

          throw new Error(response.data.message);

        case 7:
          console.log("data from the get course details", response.data.courseDetail);
          return _context6.abrupt("return", response.data.courseDetail);

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](0);
          console.log('error occured while getting course details: ', _context6.t0.message);
          console.error(_context6.t0.message);

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.getCourseDetails = getCourseDetails;

var getFullDetailsOfCourse = function getFullDetailsOfCourse(courseId, token) {
  var response;
  return regeneratorRuntime.async(function getFullDetailsOfCourse$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.GET_FULL_COURSE_DETAILS_AUTHENTICATED, {
            courseId: courseId
          }, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context7.sent;

          if (response.data.success) {
            _context7.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          console.log('response of the full course details is:- ', response.data.data);
          return _context7.abrupt("return", response.data.data);

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.log('error occured while getting full details of course: ', _context7.t0.message);
          console.error(_context7.t0.message);

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getFullDetailsOfCourse = getFullDetailsOfCourse;

var createSection = function createSection(_ref, token) {
  var sectionName, courseId, response;
  return regeneratorRuntime.async(function createSection$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          sectionName = _ref.sectionName, courseId = _ref.courseId;
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.CREATE_SECTION_API, {
            sectionName: sectionName,
            courseId: courseId
          }, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 4:
          response = _context8.sent;

          if (response.data.success) {
            _context8.next = 7;
            break;
          }

          throw new Error(response.data.message);

        case 7:
          return _context8.abrupt("return", response.data.course);

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](1);
          console.log('error occured while creating a section: ', _context8.t0.message);
          console.error(_context8.t0.message);

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

exports.createSection = createSection;

var updateSection = function updateSection(_ref2, token) {
  var sectionName, sectionId, courseId, response;
  return regeneratorRuntime.async(function updateSection$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          sectionName = _ref2.sectionName, sectionId = _ref2.sectionId, courseId = _ref2.courseId;
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.UPDATE_SECTION_API, {
            sectionName: sectionName,
            sectionId: sectionId,
            courseId: courseId
          }, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 4:
          response = _context9.sent;

          if (response.data.success) {
            _context9.next = 7;
            break;
          }

          throw new Error(response.data.message);

        case 7:
          console.log(response.data.message);
          return _context9.abrupt("return", response.data.course);

        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](1);
          console.log('error occured while updating a section: ', _context9.t0.message);
          console.error(_context9.t0.message);

        case 15:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 11]]);
};

exports.updateSection = updateSection;

var deleteSection = function deleteSection(courseId, sectionId, token) {
  var response;
  return regeneratorRuntime.async(function deleteSection$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.DELETE_SECTION_API, {
            courseId: courseId,
            sectionId: sectionId
          }, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context10.sent;

          if (response.data.success) {
            _context10.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          return _context10.abrupt("return", response.data.course);

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.log('error occured while deleting a section: ', _context10.t0.message);
          console.error(_context10.t0.message);

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.deleteSection = deleteSection;

var deleteSubsection = function deleteSubsection(courseId, sectionId, subSectionId, token) {
  var response;
  return regeneratorRuntime.async(function deleteSubsection$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.DELETE_SUBSECTION_API, {
            courseId: courseId,
            sectionId: sectionId,
            subSectionId: subSectionId
          }, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context11.sent;

          if (response.data.success) {
            _context11.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          return _context11.abrupt("return", response.data.course);

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](0);
          console.log('error occured while deleting a subsection: ', _context11.t0.message);
          console.error(_context11.t0.message);

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.deleteSubsection = deleteSubsection;

var createSubSection = function createSubSection(formData, token) {
  var response;
  return regeneratorRuntime.async(function createSubSection$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.CREATE_SUBSECTION_API, formData, {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context12.sent;

          if (response.data.success) {
            _context12.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          return _context12.abrupt("return", response.data.course);

        case 9:
          _context12.prev = 9;
          _context12.t0 = _context12["catch"](0);
          console.log('error occured while creating a subsection: ', _context12.t0.message);
          console.error(_context12.t0.message);

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.createSubSection = createSubSection;

var updateSubsection = function updateSubsection(formData, token) {
  var response;
  return regeneratorRuntime.async(function updateSubsection$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.UPDATE_SUBSECTION_API, formData, {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context13.sent;

          if (response.data.success) {
            _context13.next = 6;
            break;
          }

          throw new Error(response.data.message);

        case 6:
          return _context13.abrupt("return", response.data.course);

        case 9:
          _context13.prev = 9;
          _context13.t0 = _context13["catch"](0);
          console.log('error occured while updating a subsection: ', _context13.t0.message);
          console.error(_context13.t0.message);

        case 13:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.updateSubsection = updateSubsection;

var saveReview = function saveReview(courseId, rating, review, token) {
  var toastId, response;
  return regeneratorRuntime.async(function saveReview$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          toastId = _reactHotToast["default"].loading('Posting Review...');
          _context14.prev = 1;
          _context14.next = 4;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.CREATE_RATING_API, {
            courseId: courseId,
            rating: rating,
            review: review
          }, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 4:
          response = _context14.sent;

          if (response.data.success) {
            _context14.next = 7;
            break;
          }

          throw new Error(response.data.message);

        case 7:
          _reactHotToast["default"].dismiss(toastId);

          _reactHotToast["default"].success('Review Posted Successfully');

          _context14.next = 17;
          break;

        case 11:
          _context14.prev = 11;
          _context14.t0 = _context14["catch"](1);

          _reactHotToast["default"].dismiss(toastId);

          _reactHotToast["default"].error('Failed to save review');

          console.log('error occured while saving review: ', _context14.t0.message);
          console.error(_context14.t0.message);

        case 17:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[1, 11]]);
};

exports.saveReview = saveReview;

var markLectureAsComplete = function markLectureAsComplete(courseId, subsectionId, token) {
  var response;
  return regeneratorRuntime.async(function markLectureAsComplete$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap((0, _apiconnector.apiConnector)('POST', _api.courseEndpoints.LECTURE_COMPLETION_API, {
            courseId: courseId,
            subsectionId: subsectionId
          }, {
            'Authorization': "Bearer ".concat(token)
          }));

        case 3:
          response = _context15.sent;

          if (response.data.success) {
            _context15.next = 7;
            break;
          }

          _reactHotToast["default"].error('Lecture can not be marked as complete');

          throw new Error(response.data.message);

        case 7:
          _context15.next = 13;
          break;

        case 9:
          _context15.prev = 9;
          _context15.t0 = _context15["catch"](0);
          console.log('error occured while marking lecture as complete: ', _context15.t0.message);
          console.error(_context15.t0.message);

        case 13:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.markLectureAsComplete = markLectureAsComplete;
//# sourceMappingURL=courseDetailsAPI.dev.js.map
