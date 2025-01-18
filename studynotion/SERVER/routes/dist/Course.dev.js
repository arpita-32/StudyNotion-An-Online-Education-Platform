"use strict";

// Import the required modules
var express = require("express");

var router = express.Router(); // Import the Controllers
// Course Controllers Import

var _require = require("../controllers/Course"),
    createCourse = _require.createCourse,
    getAllCourses = _require.getAllCourses,
    getCourseDetails = _require.getCourseDetails,
    getFullCourseDetails = _require.getFullCourseDetails,
    editCourse = _require.editCourse,
    getInstructorCourses = _require.getInstructorCourses,
    deleteCourse = _require.deleteCourse; // Categories Controllers Import


var _require2 = require("../controllers/Category"),
    showAllCategories = _require2.showAllCategories,
    createCategory = _require2.createCategory,
    categoryPageDetails = _require2.categoryPageDetails; // Sections Controllers Import


var _require3 = require("../controllers/Section"),
    createSection = _require3.createSection,
    updateSection = _require3.updateSection,
    deleteSection = _require3.deleteSection; // Sub-Sections Controllers Import


var _require4 = require("../controllers/Subsection"),
    createSubSection = _require4.createSubSection,
    updateSubSection = _require4.updateSubSection,
    deleteSubSection = _require4.deleteSubSection; // Rating Controllers Import


var _require5 = require("../controllers/RatingAndReview"),
    createRating = _require5.createRating,
    getAverageRating = _require5.getAverageRating,
    getAllRating = _require5.getAllRating;

var _require6 = require("../controllers/courseProgress"),
    updateCourseProgress = _require6.updateCourseProgress; // Importing Middlewares


var _require7 = require("../middlewares/auth"),
    auth = _require7.auth,
    isInstructor = _require7.isInstructor,
    isStudent = _require7.isStudent,
    isAdmin = _require7.isAdmin; // ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
// Courses can Only be Created by Instructors


router.post("/createCourse", auth, isInstructor, createCourse); //Add a Section to a Course

router.post("/addSection", auth, isInstructor, createSection); // Update a Section

router.post("/updateSection", auth, isInstructor, updateSection); // Delete a Section

router.post("/deleteSection", auth, isInstructor, deleteSection); // Edit Sub Section

router.post("/updateSubSection", auth, isInstructor, updateSubSection); // Delete Sub Section

router.post("/deleteSubSection", auth, isInstructor, deleteSubSection); // Add a Sub Section to a Section

router.post("/addSubSection", auth, isInstructor, createSubSection); // Get all Registered Courses

router.post("/getAllCourses", getAllCourses); // Get Details for a Specific Courses

router.post("/getCourseDetails", getCourseDetails); // Get Details for a Specific Courses

router.post("/getFullCourseDetails", auth, getFullCourseDetails); // Edit Course routes

router.post("/editCourse", auth, isInstructor, editCourse); // Get all Courses Under a Specific Instructor

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses); // Delete a Course

router["delete"]("/deleteCourse", deleteCourse);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress); // ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails); // ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);
module.exports = router;
//# sourceMappingURL=Course.dev.js.map
