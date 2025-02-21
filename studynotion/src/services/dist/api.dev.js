"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contactusEndpoint = exports.catalogData = exports.categories = exports.ratingsEndpoints = exports.courseEndpoints = exports.studentEndpoints = exports.profile = exports.ContactEndpoint = exports.endpoints = void 0;
//here we will mention the url of links 
var BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:4000/api/v1'; // AUTH ENDPOINTS

var endpoints = {
  SENDOTP_API: BASE_URL + "/auth/generateOtp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  CHANGEPASSWORD_API: BASE_URL + "/auth/changepassword"
};
exports.endpoints = endpoints;
var ContactEndpoint = {
  CONTATUS_API: BASE_URL + "/reach/contact"
}; //PROFILE ENDPOINTS

exports.ContactEndpoint = ContactEndpoint;
var profile = {
  GET_USER_DETAILS: BASE_URL + "/profile/getUserDetails",
  UPDATE_DISPLAY_PICTURE: BASE_URL + "/profile/updateDisplayPicture",
  GET_ENROLLED_COURSES: BASE_URL + "/profile/getEnrolledCourses",
  DELETE_ACCOUNT: BASE_URL + "/profile/deleteProfile",
  UPDATE_PROFILE: BASE_URL + "/profile/updateProfile",
  INSTRUCTOR_DASHBOARD: BASE_URL + "/profile/instructorDashboard"
}; // STUDENTS ENDPOINTS

exports.profile = profile;
var studentEndpoints = {} // COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
// COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
// SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
// COURSE ENDPOINTS
;
exports.studentEndpoints = studentEndpoints;
var courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating"
}; // RATINGS AND REVIEWS

exports.courseEndpoints = courseEndpoints;
var ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews"
}; // CATAGORIES API

exports.ratingsEndpoints = ratingsEndpoints;
var categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories"
}; // CATALOG PAGE DATA

exports.categories = categories;
var catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails"
}; // CONTACT-US API

exports.catalogData = catalogData;
var contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact"
};
exports.contactusEndpoint = contactusEndpoint;
//# sourceMappingURL=api.dev.js.map
