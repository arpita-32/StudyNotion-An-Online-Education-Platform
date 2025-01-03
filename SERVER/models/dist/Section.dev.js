"use strict";

var mongoose = require("mongoose");

var SubSection = require("./SubSection");

var sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String
  },
  subSection: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "SubSection"
  }]
});
module.exports = mongoose.model("Section", sectionSchema);
//# sourceMappingURL=Section.dev.js.map
