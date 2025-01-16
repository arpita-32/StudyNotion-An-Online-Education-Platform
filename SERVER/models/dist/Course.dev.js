"use strict";

var mongoose = require("mongoose");

var coursesSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  whatYouWillLearn: {
    type: String,
    required: true
  },
  courseContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section"
  }],
  ratingAndReviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingAndReview"
  }],
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  tag: {
    type: [String],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category"
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }],
  instructions: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    "enum": ["Draft", "Published"],
    "default": "Draft"
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Course", coursesSchema);
//# sourceMappingURL=Course.dev.js.map
