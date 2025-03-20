"use strict";

var mongoose = require("mongoose"); // Define the Tags schema


var categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]
}); // Export the Tags model

module.exports = mongoose.model("Category", categorySchema);
//# sourceMappingURL=Category.dev.js.map
