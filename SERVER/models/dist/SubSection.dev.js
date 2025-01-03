"use strict";

var mongoose = require("mongoose");

var subSectionSchema = new mongoose.Schema({
  title: {
    type: String
  },
  timeDuration: {
    type: String
  },
  description: {
    type: String
  },
  videoUrl: {
    type: String
  }
});
module.exports = mongoose.model("SubSection", subSectionSchema);
//# sourceMappingURL=SubSection.dev.js.map
