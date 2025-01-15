"use strict";

var cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = function _callee(file, folder, innerHeight, quality) {
  var options;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          options = {
            folder: folder
          }; // Initialize options with the folder

          if (innerHeight) {
            // Use the correct parameter
            options.height = innerHeight;
          }

          if (quality) {
            options.quality = quality;
          }

          options.resource_type = "auto"; // Ensure resource type is set

          _context.next = 6;
          return regeneratorRuntime.awrap(cloudinary.uploader.upload(file.tempFilePath, options));

        case 6:
          return _context.abrupt("return", _context.sent);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};
//# sourceMappingURL=imageUploader.dev.js.map
