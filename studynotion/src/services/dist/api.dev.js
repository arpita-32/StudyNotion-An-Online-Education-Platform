"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.settingsEndpoints = exports.contactusEndpoint = exports.catalogData = exports.categories = exports.ratingsEndpoints = exports.courseEndpoints = exports.studentEndpoints = exports.profileEndpoints = exports.endpoints = void 0;
var BASE_URL = "http://localhost:4000/api/v1"; // AUTH ENDPOINTS

var endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password"
}; // Make sure your endpoints are correctly defined

exports.endpoints = endpoints;
var profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard"
}; // STUDENTS ENDPOINTS

exports.profileEndpoints = profileEndpoints;
var studentEndpoints = {
  CREATE_STRIPE_CHECKOUT_SESSION: BASE_URL + "/payment/create-checkout-session",
  VERIFY_STRIPE_PAYMENT: BASE_URL + "/payment/verify-stripe-payment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/send-payment-success-email",
  STRIPE_WEBHOOK: BASE_URL + "/payment/stripe-webhook" // For backend use

}; // COURSE ENDPOINTS

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
  CATALOGPAGEDATA_API: BASE_URL + "/course/CategoryPageDetails"
}; // CONTACT-US API

exports.catalogData = catalogData;
var contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact"
}; // SETTINGS PAGE API

exports.contactusEndpoint = contactusEndpoint;
var settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile"
};
exports.settingsEndpoints = settingsEndpoints;
//# sourceMappingURL=api.dev.js.map
