require("dotenv").config();
const Stripe = require("stripe");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const { sendEmail } = require("../utils/mailSender");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Function to Start Payment
const startPayment = async (req, res) => {
    try {
        const { products, userId } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid product data" });
        }

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: { name: product.courseName },
                unit_amount: product.price * 100,
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            success_url: "https://study-notion-frontend-nine-sable.vercel.app/dashboard/enrolled-courses",
            cancel_url: "https://study-notion-frontend-nine-sable.vercel.app/dashboard/cart",
            metadata: {
                userID: userId,
                courses: JSON.stringify(products.map((p) => p.courseId)),
            },
        });

        res.json({ id: session.id });
    } catch (err) {
        console.error("❌ Error in payment session creation:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Function to Handle Stripe Webhooks
const verifySignature = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("❌ Webhook verification failed:", err.message);
        return res.status(400).json({ success: false, message: err.message });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userID = session.metadata.userID;
        const courses = JSON.parse(session.metadata.courses);
        await enrollStudent(userID, courses);
    }

    res.status(200).json({ received: true });
};

// ✅ Function to Enroll Students After Payment
const enrollStudent = async (userID, courses) => {
    try {
        const user = await User.findById(userID);

        for (const courseId of courses) {
            const course = await Course.findById(courseId);

            if (course.studentsEnrolled.includes(user._id)) {
                console.log(`User already enrolled in course: ${courseId}`);
                continue;
            }

            // ✅ Update course enrollment
            await Course.findByIdAndUpdate(courseId, { $push: { studentsEnrolled: userID } });

            // ✅ Update user progress
            const progress = await CourseProgress.create({ courseID: courseId, userId: userID, completedVideos: [] });
            await User.findByIdAndUpdate(userID, { $push: { courses: courseId, courseProgress: progress._id } });

            // ✅ Send confirmation email
            await sendEmail(user.email, "Course Enrollment Confirmation", courseEnrollmentEmail(course.courseName, user.firstName));
        }

        console.log("✅ Enrollment successful");

    } catch (err) {
        console.error("❌ Error enrolling student:", err.message);
    }
};

// ✅ Export Functions (Add this at the bottom!)
module.exports = { startPayment, verifySignature };
