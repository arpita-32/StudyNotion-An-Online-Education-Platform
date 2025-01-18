const jwt = require("jsonwebtoken")
require("dotenv").config();
const User = require("../models/User");

exports.auth = (req, res, next) => {
    try {

        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);


        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer","");
        // const token = req.cookie.token

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: "token missing"
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            console.log(decode);

            req.user = decode;
        }
        catch (e) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }

        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for students you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is cannot be verified"
        })
    }
}
exports.isInstructor = (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for Instructor only"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Instructor is not Matching"
        })
    }
}
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for Admins,you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}