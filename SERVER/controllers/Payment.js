const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const mongoose = require("mongoose");

// Capture Payment
exports.capturePayment = async (req, res) => {
    const { course_id } = req.body;
    const userId = req.user.id;

    if (!course_id) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid course ID",
        });
    }

    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Could not find the course",
            });
        }

        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(400).json({
                success: false,
                message: "Student is already enrolled",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving course details",
        });
    }

    const amount = course.price * 100; // Stripe processes amounts in cents
    const currency = "INR";

    try {
        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                courseId: course_id,
                userId,
            },
        });

        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate payment",
        });
    }
};

// Handle Payment Completion
exports.handlePaymentSuccess = async (req, res) => {
    const { course_id, user_id } = req.body;

    if (!course_id || !user_id) {
        return res.status(400).json({
            success: false,
            message: "Course ID and User ID are required",
        });
    }

    try {
        // Update the course and user documents
        const enrolledCourse = await Course.findByIdAndUpdate(
            course_id,
            { $push: { studentsEnrolled: user_id } },
            { new: true }
        );

        if (!enrolledCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const enrolledStudent = await User.findByIdAndUpdate(
            user_id,
            { $push: { courses: course_id } },
            { new: true }
        );

        if (!enrolledStudent) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Send email
        const emailResponse = await mailSender(
            enrolledStudent.email,
            "Course Enrollment Success",
            courseEnrollmentEmail(enrolledCourse.courseName)
        );

        console.log("Email sent: ", emailResponse);

        return res.status(200).json({
            success: true,
            message: "Payment successful and course enrollment updated",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error processing payment",
        });
    }
};
