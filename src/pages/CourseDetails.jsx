import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RatingStars from "../../src/components/common/RatingStars";
import { formatDate } from "../services/formatDate";
import { AiTwotoneClockCircle } from "react-icons/ai";
import { MdLanguage } from "react-icons/md";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { useNavigate, useParams } from "react-router-dom";
import GetAvgRating from "../utils/avgRating";
import Footer from "../components/common/Footer";
import { buyCourse } from "../services/operations/StudentFeaturesAPI";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../components/common/ConfirmationModal";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [courses, setCourses] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isActive, setIsActive] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleBuyCourse = async () => {
    try {
      setPaymentProcessing(true);
      const response = await buyCourse(courseId, token);
      if (response.success) {
        toast.success("Course purchased successfully!");
        navigate("/dashboard/enrolled-courses");
      } else {
        toast.error(response.message || "Failed to purchase course.");
      }
    } catch (error) {
      toast.error("An error occurred while purchasing the course.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ... rest of your component logic remains the same ...

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-richblack-100">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!courses?.data?.courseDetails) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <p className="text-2xl font-bold text-richblack-100">Course not found</p>
      </div>
    );
  }

  const courseDetails = courses.data.courseDetails;
  const instructor = courseDetails.instructor || {};

  return (
    <Elements stripe={stripePromise}>
      <div className="relative">
        {/* Hero Section */}
        <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[430px] bg-richblack-800 relative flex flex-col lg:flex-row justify-start items-center lg:items-start lg:pt-12 px-4 sm:px-6 lg:px-8">
          {/* ... hero section content remains the same ... */}
          
          {/* Course Details Card - Mobile */}
          <div className="lg:hidden w-full mt-6 sm:mt-8">
            <CourseDetailsCard
              setConfirmationModal={setConfirmationModal}
              course={courseDetails}
              handleBuyCourse={handleBuyCourse}
              paymentProcessing={paymentProcessing}
              showCardElement={true}
            />
          </div>
        </div>

        {/* Course Details Card - Desktop */}
        <div className="hidden lg:block bg-richblack-700 min-h-[500px] lg:min-h-[600px] rounded-md px-6 py-4 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[430px]
          -mt-[300px] lg:-mt-[380px] right-[1rem] mx-auto absolute mr-[40px]">
          <CourseDetailsCard
            setConfirmationModal={setConfirmationModal}
            course={courseDetails}
            handleBuyCourse={handleBuyCourse}
            paymentProcessing={paymentProcessing}
            showCardElement={false}
          />
        </div>

        {/* What You'll Learn */}
        <div className="text-white mx-4 sm:mx-6 lg:ml-[70px] mt-6 sm:mt-8 lg:mt-[30px] px-4 sm:px-5 py-4 sm:py-5 w-[90%] lg:w-[56%] border border-richblack-500 space-y-2 sm:space-y-3">
          {/* ... what you'll learn content remains the same ... */}
        </div>

        {/* Course Content */}
        <div className="text-white mx-4 sm:mx-6 lg:ml-[50px] mt-6 sm:mt-8 lg:mt-[20px] px-4 sm:px-5 py-4 sm:py-5 w-[90%] lg:w-[56%] space-y-2 sm:space-y-3">
          {/* ... course content remains the same ... */}
        </div>

        <Footer />

        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      </div>
    </Elements>
  );
};

export default CourseDetails;