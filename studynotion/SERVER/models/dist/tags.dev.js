"use strict";

var mongoose = require("mongoose");

var tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
});
module.exports = mongoose.model("Tag", tagsSchema);
//# sourceMappingURL=tags.dev.js.map
