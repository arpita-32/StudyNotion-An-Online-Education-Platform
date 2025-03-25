require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");

// Create Stripe checkout session
exports.createCheckoutSession = async (req, res) => {
    try {
        const { products, userId } = req.body;
        
        // Validate input
        if (!products || !userId || !Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data"
            });
        }

        const lineItems = products.map((product) => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: product.courseName,
                        metadata: {
                            courseId: product._id
                        }
                    },
                    unit_amount: Math.round(product.price * 100), // in paise
                },
                quantity: 1,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: "http://localhost:3000/login",
            cancel_url: "http://localhost:3000/error",
            client_reference_id: userId,
            metadata: {
                courseIds: JSON.stringify(products.map(p => p._id))
            }
        });

        return res.json({ 
            success: true,
            id: session.id 
        });

    } catch (err) {
        console.error('Error creating checkout session:', err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Handle Stripe webhook
// In your handleStripeWebhook controller
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Verify the payment was successful
            if (session.payment_status === 'paid') {
                const userId = session.client_reference_id;
                const courseIds = JSON.parse(session.metadata.courseIds);
                
                // Enroll the user
                await enrollStudents(courseIds, userId);
                
                // Update user data
                const user = await User.findById(userId);
                if (user) {
                    await mailSender(
                        user.email,
                        `Payment Received`,
                        paymentSuccessEmail(
                            `${user.firstName} ${user.lastName}`,
                            session.amount_total / 100,
                            session.id
                        )
                    );
                }
            }
        }
        
        res.status(200).json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

// Enrollment function
const enrollStudents = async (courseIds, userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        for (const courseId of courseIds) {
            // Check if already enrolled
            if (user.courses.includes(courseId)) {
                continue;
            }

            // Update course
            const updatedCourse = await Course.findByIdAndUpdate(
                courseId,
                { $addToSet: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!updatedCourse) {
                console.error(`Course not found: ${courseId}`);
                continue;
            }

            // Create course progress
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });

            // Update user
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            // Send email
            await mailSender(
                user.email,
                `Successfully Enrolled into ${updatedCourse.courseName}`,
                courseEnrollmentEmail(
                    updatedCourse.courseName,
                    `${user.firstName} ${user.lastName}`
                )
            );
        }
    } catch (error) {
        console.error("Error in enrollment:", error);
        throw error;
    }
};

// Send payment success email (for direct API calls)
exports.sendPaymentSuccessEmail = async (req, res) => {
    try {
        const { orderId, paymentId, amount, userId } = req.body;

        if (!orderId || !paymentId || !amount || !userId) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        await mailSender(
            user.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${user.firstName} ${user.lastName}`,
                amount,
                orderId,
                paymentId
            )
        );

        return res.json({ success: true });
    } catch (err) {
        console.error('Error sending payment email:', err);
        return res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};