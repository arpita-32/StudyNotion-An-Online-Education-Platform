const mongoose = require("mongoose");
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // Document will be automatically deleted after 5 minutes
    }
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email from StudyNotion",
            `<h1>Please verify your email</h1>
            <p>Your OTP for verification is: ${otp}</p>
            <p>This OTP is valid for 5 minutes</p>`
        );
        return mailResponse;
    } catch (error) {
        console.log("Error occurred while sending verification email:", error);
        throw error;
    }
}

// Pre-save middleware to send OTP email
OTPSchema.pre("save", async function(next) {
    try {
        await sendVerificationEmail(this.email, this.otp);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("OTP", OTPSchema);