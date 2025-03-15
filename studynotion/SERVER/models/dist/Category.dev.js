"use strict";

var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});
module.exports = mongoose.model('Category', CategorySchema);
//# sourceMappingURL=Category.dev.js.map
