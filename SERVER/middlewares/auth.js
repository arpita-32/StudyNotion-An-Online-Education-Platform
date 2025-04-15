// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

exports.auth = async (req, res, next) => {
	try {
	  // Extract token only from Authorization header
	  const authHeader = req.header("Authorization");
	  if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ 
		  success: false, 
		  message: "Authorization header missing or invalid" 
		});
	  }
	  
	  const token = authHeader.replace("Bearer ", "");
  
	  try {
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decode; // Attach decoded user to request
		console.log("Decoded token:", decode); // Debug log
	  } catch (error) {
		console.error("Token verification failed:", error);
		return res.status(401).json({ 
		  success: false, 
		  message: "Invalid or expired token" 
		});
	  }
  
	  next();
	} catch (error) {
	  console.error("Authentication error:", error);
	  return res.status(401).json({
		success: false,
		message: "Authentication failed"
	  });
	}
  };
  exports.isStudent = async (req, res, next) => {
	try {
	  // First check if user object exists from auth middleware
	  if (!req.user || !req.user.email) {
		return res.status(401).json({
		  success: false,
		  message: "User authentication required"
		});
	  }
  
	  const userDetails = await User.findOne({ email: req.user.email }).select("accountType");
	  
	  if (!userDetails) {
		return res.status(404).json({
		  success: false,
		  message: "User not found"
		});
	  }
  
	  if (userDetails.accountType !== "Student") {
		return res.status(403).json({
		  success: false,
		  message: "This route is restricted to students only"
		});
	  }
  
	  next();
	} catch (error) {
	  console.error("Role verification error:", error);
	  return res.status(500).json({ 
		success: false, 
		message: "Unable to verify user role" 
	  });
	}
  };
exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};