const { Mongoose } = require("mongoose");
const Category = require("../models/Category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Category Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false, // Changed to false (this was true in original code)
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }
    
    console.log("PRINTING CATEGORY ID: ", categoryId);
    
    // Step 1: Get the selected category with populated courses
    // Remove the ratingAndReviews population that's causing the error
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" }
        // Removed the ratingAndReviews population
      })
      .exec();
    
    if (!selectedCategory) {
      console.log("Category not found.");
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }
    
    // Handle the case when there are no courses
    if (!selectedCategory.courses || selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }
    
    // Step 2: Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    
    let differentCategory = null;
    
    if (categoriesExceptSelected && categoriesExceptSelected.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoriesExceptSelected.length);
      const randomCategoryId = categoriesExceptSelected[randomIndex]._id;
      
      differentCategory = await Category.findById(randomCategoryId)
        .populate({
          path: "courses",
          match: { status: "Published" }
        })
        .exec();
    } else {
      // If no other categories exist, use the selected category
      differentCategory = selectedCategory;
    }
    
    // Step 3: Get top-selling courses
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor", // Keep this population as it should be valid
        },
      })
      .exec();
    
    const allCourses = [];
    allCategories.forEach(category => {
      if (category.courses && Array.isArray(category.courses)) {
        allCourses.push(...category.courses);
      }
    });
    
    const mostSellingCourses = allCourses
      .filter(course => course !== null && course !== undefined)
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 10);
    
    // Step 4: Return the successful response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
    
  } catch (error) {
    console.error("Error in categoryPageDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};