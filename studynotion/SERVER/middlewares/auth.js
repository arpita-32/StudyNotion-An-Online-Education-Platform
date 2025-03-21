const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

// Configuring dotenv to load environment variables from .env file
dotenv.config();

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
  try {
    // Extracting JWT from request cookies, body or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Extracted Token:", token); // Log the extracted token

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }

    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decode); // Log the decoded token

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decode.exp < currentTime) {
        return res.status(401).json({ success: false, message: "Token has expired" });
      }

      // Storing the decoded JWT payload in the request object for further use
      req.user = decode;
    } catch (error) {
      // If JWT verification fails, return 401 Unauthorized response
      console.log("Token Verification Error:", error); // Log the error
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }

    // If JWT is valid, move on to the next middleware or request handler
    next();
  } catch (error) {
    // If there is an error during the authentication process, return 401 Unauthorized response
    console.log("Authentication Error:", error); // Log the error
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
};

// Middleware to check if the user is a student
exports.isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    console.log("User Details:", userDetails); // Log user details

    if (userDetails.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Students",
      });
    }
    next();
  } catch (error) {
    console.log("Role Verification Error:", error); // Log the error
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    console.log("User Details:", userDetails); // Log user details

    if (userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }
    next();
  } catch (error) {
    console.log("Role Verification Error:", error); // Log the error
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

// Middleware to check if the user is an instructor
exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    console.log("User Details:", userDetails); // Log user details

    if (userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Instructor",
      });
    }
    next();
  } catch (error) {
    console.log("Role Verification Error:", error); // Log the error
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};