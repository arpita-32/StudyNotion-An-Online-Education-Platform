"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("mongoose"),
    Mongoose = _require.Mongoose;

var Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.createCategory = function _callee(req, res) {
  var _req$body, name, description, CategorysDetails;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, description = _req$body.description;

          if (name) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "All fields are required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Category.create({
            name: name,
            description: description
          }));

        case 6:
          CategorysDetails = _context.sent;
          console.log(CategorysDetails);
          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: "Category Created Successfully"
          }));

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            // Changed to false (this was true in original code)
            message: _context.t0.message
          }));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.showAllCategories = function _callee2(req, res) {
  var allCategorys;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("INSIDE SHOW ALL CATEGORIES");
          _context2.next = 4;
          return regeneratorRuntime.awrap(Category.find({}));

        case 4:
          allCategorys = _context2.sent;
          res.status(200).json({
            success: true,
            data: allCategorys
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: _context2.t0.message
          }));

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.categoryPageDetails = function _callee3(req, res) {
  var categoryId, selectedCategory, categoriesExceptSelected, differentCategory, randomIndex, randomCategoryId, allCategories, allCourses, mostSellingCourses;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          categoryId = req.body.categoryId;

          if (categoryId) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Category ID is required"
          }));

        case 4:
          console.log("PRINTING CATEGORY ID: ", categoryId); // Step 1: Get the selected category with populated courses
          // Remove the ratingAndReviews population that's causing the error

          _context3.next = 7;
          return regeneratorRuntime.awrap(Category.findById(categoryId).populate({
            path: "courses",
            match: {
              status: "Published"
            } // Removed the ratingAndReviews population

          }).exec());

        case 7:
          selectedCategory = _context3.sent;

          if (selectedCategory) {
            _context3.next = 11;
            break;
          }

          console.log("Category not found.");
          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Category not found"
          }));

        case 11:
          if (!(!selectedCategory.courses || selectedCategory.courses.length === 0)) {
            _context3.next = 14;
            break;
          }

          console.log("No courses found for the selected category.");
          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "No courses found for the selected category."
          }));

        case 14:
          _context3.next = 16;
          return regeneratorRuntime.awrap(Category.find({
            _id: {
              $ne: categoryId
            }
          }));

        case 16:
          categoriesExceptSelected = _context3.sent;
          differentCategory = null;

          if (!(categoriesExceptSelected && categoriesExceptSelected.length > 0)) {
            _context3.next = 26;
            break;
          }

          randomIndex = Math.floor(Math.random() * categoriesExceptSelected.length);
          randomCategoryId = categoriesExceptSelected[randomIndex]._id;
          _context3.next = 23;
          return regeneratorRuntime.awrap(Category.findById(randomCategoryId).populate({
            path: "courses",
            match: {
              status: "Published"
            }
          }).exec());

        case 23:
          differentCategory = _context3.sent;
          _context3.next = 27;
          break;

        case 26:
          // If no other categories exist, use the selected category
          differentCategory = selectedCategory;

        case 27:
          _context3.next = 29;
          return regeneratorRuntime.awrap(Category.find().populate({
            path: "courses",
            match: {
              status: "Published"
            },
            populate: {
              path: "instructor" // Keep this population as it should be valid

            }
          }).exec());

        case 29:
          allCategories = _context3.sent;
          allCourses = [];
          allCategories.forEach(function (category) {
            if (category.courses && Array.isArray(category.courses)) {
              allCourses.push.apply(allCourses, _toConsumableArray(category.courses));
            }
          });
          mostSellingCourses = allCourses.filter(function (course) {
            return course !== null && course !== undefined;
          }).sort(function (a, b) {
            return (b.sold || 0) - (a.sold || 0);
          }).slice(0, 10); // Step 4: Return the successful response

          return _context3.abrupt("return", res.status(200).json({
            success: true,
            data: {
              selectedCategory: selectedCategory,
              differentCategory: differentCategory,
              mostSellingCourses: mostSellingCourses
            }
          }));

        case 36:
          _context3.prev = 36;
          _context3.t0 = _context3["catch"](0);
          console.error("Error in categoryPageDetails:", _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: "Internal server error",
            error: _context3.t0.message
          }));

        case 40:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 36]]);
};
//# sourceMappingURL=Category.dev.js.map
