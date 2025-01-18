"use strict";

var mongoose = require("mongoose");

require("dotenv").config();

exports.connect = function () {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(function () {
    console.log("DB connected successfully");
  })["catch"](function (err) {
    console.log("DB connection issues");
    console.error(err);
    process.exit(1);
  });
};
//# sourceMappingURL=database.dev.js.map
