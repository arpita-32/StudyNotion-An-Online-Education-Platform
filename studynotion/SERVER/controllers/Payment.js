require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")

let userID,courses;
exports.startPayment = async (req, resp) => {
    try{
         
        const {products} = req.body;
        courses = products;
        const {userId} = req.body; 
        userID = userId;

        const lineItem = products.map((product) => {
            return {
                price_data:{
                   currency:'inr',
                   product_data:{
                      name:product.courseName
                   },
                   unit_amount: product.price*100
                },
                quantity:1
            }
        })   
        console.log("Generated Line Items:", lineItem);

        const session = await stripe.checkout.sessions.create({
            mode:'payment',
            payment_method_types:['card'],
            line_items:lineItem,
            success_url: "http://localhost:3000/login",
            cancel_url: "http://localhost:3000/error",
    
        })

        resp.json({id:session.id});

    }catch(err){
        console.log('error occured  while starting payment:- ',err.message);
        console.error(err.message);
        return resp.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.verifySignature = async(req, resp) => {
    
    const signature = req.headers['stripe-signature'];
    let event;
try{
    event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
    );

}catch(err){
    console.log('error occured while verifying signature:- ', err.message);
    console.error(err.message);
    return resp.status(500).json({
        success:false,
        message:err.message
    })
}

if(event.type === 'payment_intent.succeeded'){

    await enrollStudents(userID,courses,resp);
    resp.json({recieved:true});

}
else{
    console.log('unhandled event type');
    return resp.status(400).json({
        success: false,
        message: 'Unhandled event type',
    });
}}
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }
  
  const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }
  