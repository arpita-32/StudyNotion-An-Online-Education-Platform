const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // Password validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Verify OTP
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // Check OTP expiry (assuming 5 minutes validity)
    const otpCreationTime = recentOtp[0].createdAt;
    const currentTime = new Date();
    const timeDifference = (currentTime - otpCreationTime) / (1000 * 60); // in minutes

    if (timeDifference > 5) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create profile
    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || null,
    });

    if (!profile) {
      throw new Error("Error creating user profile");
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType || "Student",
      approved: accountType === "Instructor" ? false : true,
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // Remove sensitive information
    user.password = undefined;

    return res.status(201).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed. Please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find user and populate additional details
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found. Please sign up.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: user.email, 
        id: user._id, 
        role: user.accountType 
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Remove sensitive data
    user.password = undefined;

    // Set cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed. Please try again.",
    });
  }
};

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP
    const otpDoc = await OTP.create({
      email,
      otp,
      createdAt: Date.now(),
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error("SendOTP Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both old and new passwords are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    // Send notification email
    try {
      await mailSender(
        user.email,
        "Password Updated",
        passwordUpdated(user.email, `Password updated successfully for ${user.firstName} ${user.lastName}`)
      );
    } catch (emailError) {
      console.error("Password update email failed:", emailError);
      // Continue with success response even if email fails
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update password",
    });
  }
};