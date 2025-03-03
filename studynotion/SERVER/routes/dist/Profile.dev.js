"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../middlewares/auth"),
    auth = _require.auth,
    isInstructor = _require.isInstructor;

var _require2 = require("../controllers/Profile"),
    deleteAccount = _require2.deleteAccount,
    updateProfile = _require2.updateProfile,
    getAllUserDetails = _require2.getAllUserDetails,
    updateDisplayPicture = _require2.updateDisplayPicture,
    getEnrolledCourses = _require2.getEnrolledCourses,
    instructorDashboard = _require2.instructorDashboard; // ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account


router["delete"]("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails); // Get Enrolled Courses

router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);
module.exports = router;
//# sourceMappingURL=Profile.dev.js.map
