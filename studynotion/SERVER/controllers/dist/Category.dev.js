"use strict";

//importing required model
var _require = require("mongoose"),
    Mongoose = _require.Mongoose;

var Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
} //this is a protected route which only can be accessed by admin as only admin can create a Category and the instructor will choose any predefined Category for his course


exports.createCategory = function _callee(req, resp) {
  var _req$body, name, description, newCategory, response;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //fetch data
          _req$body = req.body, name = _req$body.name, description = _req$body.description; //validate

          if (!(!name || !description)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", resp.status(403).json({
            success: false,
            message: "all fields are required"
          }));

        case 4:
          //make db entry
          newCategory = new Category({
            name: name,
            description: description
          });
          _context.next = 7;
          return regeneratorRuntime.awrap(newCategory.save());

        case 7:
          response = _context.sent;
          return _context.abrupt("return", resp.status(201).json({
            success: true,
            message: 'new Category created successfully',
            data: response
          }));

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log('error occured during creating a new Category', _context.t0.message);
          console.error(_context.t0.message);
          console.error(_context.t0.message);
          resp.status(500).json({
            success: false,
            message: 'internal server error',
            error: _context.t0.message
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; //controller for fetching all Categorys


exports.showAllCategories = function _callee2(req, resp) {
  var Categories;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Category.find({}, {
            name: true,
            description: true
          }));

        case 3:
          Categories = _context2.sent;
          return _context2.abrupt("return", resp.status(200).json({
            success: true,
            message: 'all Categories fetched successfully',
            data: Categories
          }));

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.log('error occured during fetching all Categories', _context2.t0.message);
          console.error(_context2.t0.message);
          resp.status(500).json({
            success: false,
            message: 'internal server error',
            error: _context2.t0.message
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // categoryPageDetails 
//basically this controller returns data about:-
//1. details of choosen cateegory
//2. details of other categories
//3. most popular courses


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
            populate: "ratingAndReview"
          }).exec());

        case 5:
          selectedCategory = _context3.sent;
          console.log("SELECTED category looks like:- ", selectedCategory); // Handle the case when the category is not found

          if (selectedCategory) {
            _context3.next = 10;
            break;
          }

          console.log("Category not found.");
          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Category not found"
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(Category.find({
            _id: {
              $ne: categoryId
            }
          }));

        case 12:
          categoriesExceptSelected = _context3.sent;
          console.log('categoryexcluding', categoriesExceptSelected);
          _context3.next = 16;
          return regeneratorRuntime.awrap(Category.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id).populate({
            path: "courses",
            match: {
              status: "Published"
            }
          }).exec());

        case 16:
          differentCategory = _context3.sent;
          console.log("Different COURSE", differentCategory); // Get top-selling courses across all categories

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
          }).slice(0, 10);
          console.log("mostSellingCourses COURSE", mostSellingCourses);
          res.status(200).json({
            success: true,
            data: {
              selectedCategory: selectedCategory,
              differentCategory: differentCategory,
              mostSellingCourses: mostSellingCourses
            }
          });
          _context3.next = 30;
          break;

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            success: false,
            message: "Internal server error",
            error: _context3.t0.message
          }));

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 27]]);
};
//# sourceMappingURL=Category.dev.js.map
