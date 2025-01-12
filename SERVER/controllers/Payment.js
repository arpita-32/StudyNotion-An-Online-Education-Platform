const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/courseEnrollmentEmail");

exports.capturePayment = async (req , res) => {

    const {course_id} = req.body;
    const userId = req.user.id;

    if(!course_id) {
        return res.json({
            success:false,
            message:'Please provide valid course otp',
            
        })
    };

    let course;
    try{
        course = await Course.findById(course_id);
        if(!course) {
            return res.json({
                success:false,
                message:'could not find the course',
                
            })
        };

        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message:'student is already enrolled',

                
            });
        }
    }catch(error){
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
    }

    const amount = course.price;

    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try{
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
                message:'',

                
            });
    }
    catch(error){
            console.log(error);
            res.json({
                success:false,
                message:"could not initiate  order",
            });
    }
};


exports.verifySignature = async (req,res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);

    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("payment is auhorised");

        const  {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
            const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$push:{studentsEnrolled: userId}},
                                                {new:true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:'course not found',
                });
            }
            console.log(enrolledCourse);

            const enrolledStudent = await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$push:{courses:courseId}},
                                                {new:true},
            );

            console.log(enrolledStudent);

            const emailResponse = await mailSender(
                                enrolledStudent.email,
                                "Congratulaions"
            );

            return res.status(200).json({
                success:true,
                message:'signature verified and course added',
            });
        }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            });

        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
};

