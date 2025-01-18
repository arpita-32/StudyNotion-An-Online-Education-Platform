"use strict";

var mongoose = require("mongoose");

var profileSchema = new mongoose.Schema({
  gender: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  about: {
    type: String,
    trim: true
  },
  contactNumber: {
    type: Number,
    trim: true
  }
});
module.exports = mongoose.model("Profile", profileSchema);
//# sourceMappingURL=Profile.dev.js.map
