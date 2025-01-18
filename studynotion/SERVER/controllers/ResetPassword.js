const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
   try {
        const email = req.body.email;
        const user = await User.findOne({email: email});
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'Your email is not registered with us'
            });
        }

        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate(
            {email: email},
            {
                token: token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new: true}
        );

        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(
            email,
            "Password Reset Link",
            `Password Reset Link: ${url}`
        );

        return res.json({
            success: true,
            message: 'Email sent successfully, please check email and change password',
        });
   } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while sending reset email',
        });
   }
}

exports.resetPassword = async(req, res) => {
    try {
        const {password, confirmPassword, token} = req.body;

        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        const userDetails = await User.findOne({token: token});
        
        if(!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'Token is invalid',
            });
        }

        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Token has expired, please regenerate your token',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            {token: token},
            {
                password: hashedPassword,
                token: null,
                resetPasswordExpires: null
            },
            {new: true},
        );

        return res.json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while resetting password',
        });
    }
}