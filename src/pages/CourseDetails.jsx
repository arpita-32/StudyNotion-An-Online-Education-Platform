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
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe outside the component
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [courses, setCourses] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isActive, setIsActive] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleActive = (id) => {
    setIsActive((prevState) =>
      prevState.includes(id) ? prevState.filter((e) => e !== id) : [...prevState, id]
    );
  };

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchCourseDetails(courseId);
        
        if (!result || !result.success) {
          throw new Error(result?.message || "Failed to fetch course details");
        }
        
        setCourses(result);
      } catch (error) {
        console.error(error);
        setError(error.message || "Error loading course");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      getCourseDetails();
    }
  }, [courseId]);

  useEffect(() => {
    if (courses?.data?.courseDetails?.courseContent) {
      const lectures = courses.data.courseDetails.courseContent.reduce(
        (acc, sec) => acc + (sec.subSection?.length || 0),
        0
      );
      setTotalNoOfLectures(lectures);
    }
  }, [courses]);

  useEffect(() => {
    if (courses?.data?.courseDetails?.ratingAndReviews) {
      const count = GetAvgRating(courses.data.courseDetails.ratingAndReviews);
      setAvgReviewCount(count);
    }
  }, [courses]);

  const handleBuyCourse = async () => {
    if (!token) {
      setConfirmationModal({
        text1: "Login Required",
        text2: "Please login to purchase this course",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
      return;
    }

    try {
      // Check if already enrolled
      if (courses?.data?.courseDetails?.studentsEnrolled?.includes(user._id)) {
        toast.error("You are already enrolled in this course");
        return;
      }

      setPaymentProcessing(true);
      await buyCourse(token, [courseId], user, navigate, dispatch);
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(error.message || "Failed to initiate purchase");
    } finally {
      setPaymentProcessing(false);
    }
  };

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
          <div className="text-white lg:ml-[80px] pt-6 sm:pt-8 lg:pt-[90px] w-full lg:w-[60%]">
            <div className="space-y-2 sm:space-y-3">
              <p className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem]">
                {courseDetails.courseName}
              </p>
              <p className="text-richblack-200 text-sm sm:text-base md:text-lg lg:text-[1.25rem]">
                {courseDetails.courseDescription}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-[1.15rem]">
                <span className="text-yellow-50">{avgReviewCount || 0}</span>
                <span>
                  <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
                </span>
                <p>({courseDetails.ratingAndReviews?.length || 0} reviews)</p>
                <p>{courseDetails.studentsEnrolled?.length || 0} students enrolled</p>
              </div>

              <p className="text-sm sm:text-base md:text-lg lg:text-[1.15rem]">
                Created By {instructor.firstName} {instructor.lastName}
              </p>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm md:text-base lg:text-[1.15rem]">
                <p className="flex items-center gap-1">
                  <AiTwotoneClockCircle className="text-lg mt-0.5" />
                  Created at {formatDate(courseDetails.createdAt)}
                </p>
                <p className="flex items-center gap-1">
                  <MdLanguage className="text-lg mt-0.5" />
                  English
                </p>
              </div>
            </div>
          </div>

          {/* Course Details Card - Mobile */}
          <div className="lg:hidden w-full mt-6 sm:mt-8">
            <CourseDetailsCard
              setConfirmationModal={setConfirmationModal}
              course={courseDetails}
              handleBuyCourse={handleBuyCourse}
              paymentProcessing={paymentProcessing}
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
          />
        </div>

        {/* What You'll Learn */}
        <div className="text-white mx-4 sm:mx-6 lg:ml-[70px] mt-6 sm:mt-8 lg:mt-[30px] px-4 sm:px-5 py-4 sm:py-5 w-[90%] lg:w-[56%] border border-richblack-500 space-y-2 sm:space-y-3">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[1.8rem]">
            What You'll Learn
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-[1.15rem]">
            {courseDetails.whatYouWillLearn}
          </p>
        </div>

        {/* Course Content */}
        <div className="text-white mx-4 sm:mx-6 lg:ml-[50px] mt-6 sm:mt-8 lg:mt-[20px] px-4 sm:px-5 py-4 sm:py-5 w-[90%] lg:w-[56%] space-y-2 sm:space-y-3">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[1.8rem]">
            Course Content
          </h1>

          <div>
            <div className="text-xs sm:text-sm md:text-base lg:text-[1rem] flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <p>{courseDetails.courseContent?.length || 0} Sections(s)</p>
                <p>{totalNoOfLectures} Lecture(s)</p>
                <p>{courses.data.totalDuration} total length</p>
              </div>

              <button onClick={() => setIsActive([])} className="text-yellow-25 text-sm sm:text-base">
                Collapse all Sections
              </button>
            </div>

            <div className="py-4">
              {courseDetails.courseContent?.map((section, index) => (
                <CourseAccordionBar
                  course={section}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Section */}
            <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-12 mt-4 sm:mt-5">
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-[2rem]">
                Author
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt={`profile-${instructor.firstName}`}
                  className="aspect-square w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm sm:text-base md:text-lg lg:text-[1.15rem]">
                    {instructor.firstName} {instructor.lastName}
                  </p>
                  <p className="text-xs sm:text-sm text-richblack-200">
                    {instructor.additionalDetails?.about}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      </div>
    </Elements>
  );
};

export default CourseDetails;