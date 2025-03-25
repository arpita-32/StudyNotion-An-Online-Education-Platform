"use strict";

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
            message: "Categorys Created Successfully"
          }));

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            success: true,
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
}; //categoryPageDetails 


exports.categoryPageDetails = function _callee3(req, res) {
  var categoryId, selectedCategory, categoriesExceptSelected, differentCategory, allCategories, allCourses, mostSellingCourses;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          categoryId = req.body.categoryId;
          console.log("PRINTING CATEGORY ID: ", categoryId); // Get courses for the specified category

          _context3.next = 5;
          return regeneratorRuntime.awrap(Category.findById(categoryId).populate({
            path: "courses",
            match: {
              status: "Published"
            },
            populate: "ratingAndReviews"
          }).exec());

        case 5:
          selectedCategory = _context3.sent;

          if (selectedCategory) {
            _context3.next = 9;
            break;
          }

          console.log("Category not found.");
          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Category not found"
          }));

        case 9:
          if (!(selectedCategory.courses.length === 0)) {
            _context3.next = 12;
            break;
          }

          console.log("No courses found for the selected category.");
          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "No courses found for the selected category."
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(Category.find({
            _id: {
              $ne: categoryId
            }
          }));

        case 14:
          categoriesExceptSelected = _context3.sent;
          _context3.next = 17;
          return regeneratorRuntime.awrap(Category.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id).populate({
            path: "courses",
            match: {
              status: "Published"
            }
          }).exec());

        case 17:
          differentCategory = _context3.sent;
          _context3.next = 20;
          return regeneratorRuntime.awrap(Category.find().populate({
            path: "courses",
            match: {
              status: "Published"
            },
            populate: {
              path: "instructor"
            }
          }).exec());

        case 20:
          allCategories = _context3.sent;
          allCourses = allCategories.flatMap(function (category) {
            return category.courses;
          });
          mostSellingCourses = allCourses.sort(function (a, b) {
            return b.sold - a.sold;
          }).slice(0, 10); // console.log("mostSellingCourses COURSE", mostSellingCourses)

          res.status(200).json({
            success: true,
            data: {
              selectedCategory: selectedCategory,
              differentCategory: differentCategory,
              mostSellingCourses: mostSellingCourses
            }
          });
          _context3.next = 29;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: "Internal server error",
            error: _context3.t0.message
          }));

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 26]]);
};
//# sourceMappingURL=Category.dev.js.map
