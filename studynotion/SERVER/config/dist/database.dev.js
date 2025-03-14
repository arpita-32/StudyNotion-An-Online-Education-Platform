"use strict";

var mongoose = require("mongoose");

require("dotenv").config();

exports.connect = function () {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(function () {
    return console.log("DB Connected Successfully");
  })["catch"](function (error) {
    console.log("DB Connection Failed");
    console.error(error);
    process.exit(1);
  });
};
//# sourceMappingURL=database.dev.js.map
