"use strict";

var mongoose = require('mongoose');

var courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  //added later
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  completedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubSection"
  }]
});
module.exports = mongoose.model('Course-Progress', courseProgressSchema);
//# sourceMappingURL=CourseProgress.dev.js.map
