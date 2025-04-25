import React, { useState, useEffect } from "react";
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
import Error from "../pages/Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";

const CourseDetails = () => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [courses, setCourses] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isActive, setIsActive] = useState([]);

  const handleActive = (id) => {
    setIsActive((prevState) =>
      prevState.includes(id) ? prevState.filter((e) => e !== id) : [...prevState, id]
    );
  };

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        if (result) {
          setCourses(result);
        }
      } catch (error) {
        console.error(error);
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
    if (token) {
      await buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not Logged in",
      text2: "Please login to purchase the course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!courses?.success) {
    return <Error />;
  }

  const courseDetails = courses.data.courseDetails;
  const instructor = courseDetails.instructor || {};

  return (
    <div className="relative w-full bg-richblack-900">
      {/* Hero Section */}
      <div className="relative w-full bg-richblack-800">
        <div className="mx-auto box-content px-4 2xl:relative w-11/12">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#00000012_0px_-64px_36px_-28px_inset]"></div>
            </div>

            <div className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-white lg:my-0 lg:py-24">
              <h1 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
                {courseDetails.courseName}
              </h1>

              <p className="text-richblack-200 text-sm sm:text-base lg:text-lg">
                {courseDetails.courseDescription}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                <span className="text-yellow-50">{avgReviewCount || 0}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
                <span>({courseDetails.ratingAndReviews.length} reviews)</span>
                <span>{courseDetails.studentsEnrolled.length} students enrolled</span>
              </div>

              <p className="text-sm sm:text-base">
                Created By {instructor.firstName} {instructor.lastName}
              </p>

              <div className="flex flex-wrap gap-4 text-sm sm:text-base">
                <p className="flex items-center gap-1">
                  <AiTwotoneClockCircle className="text-lg" />
                  Created at {formatDate(courseDetails.createdAt)}
                </p>
                <p className="flex items-center gap-1">
                  <MdLanguage className="text-lg" />
                  English
                </p>
              </div>
            </div>

            {/* Course Details Card - Desktop */}
            <div className="hidden lg:block">
              <div className="absolute right-16 top-[-50px] z-50 mx-auto w-[400px] translate-y-24 rounded-md bg-richblack-700 p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <CourseDetailsCard
                  course={courseDetails}
                  setConfirmationModal={setConfirmationModal}
                  handleBuyCourse={handleBuyCourse}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details Card - Mobile */}
      <div className="mx-auto block px-4 lg:hidden lg:px-0">
        <div className="mx-auto mt-10 mb-6 z-50 w-full max-w-maxContentTab rounded-lg bg-richblack-700 p-6 lg:hidden">
          <CourseDetailsCard
            course={courseDetails}
            setConfirmationModal={setConfirmationModal}
            handleBuyCourse={handleBuyCourse}
          />
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="mx-auto box-content px-4 lg:w-[1260px] mt-10">
        <div className="mx-auto max-w-maxContentTab rounded-lg border border-richblack-500 p-6 text-white lg:mx-0 lg:max-w-[810px]">
          <h2 className="text-2xl font-bold sm:text-3xl">What You'll Learn</h2>
          <p className="mt-3 text-richblack-50 sm:text-lg">
            {courseDetails.whatYouWillLearn}
          </p>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="mx-auto box-content px-4 pb-12 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab py-8 text-white lg:mx-0 lg:max-w-[810px]">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold sm:text-3xl">Course Content</h2>

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2 text-sm sm:text-base">
                <span>{courseDetails.courseContent.length} Section(s)</span>
                <span>{totalNoOfLectures} Lecture(s)</span>
                <span>{courses.data.totalDuration} total length</span>
              </div>

              <button
                onClick={() => setIsActive([])}
                className="text-sm font-medium text-yellow-50 hover:text-yellow-25 sm:text-base"
              >
                Collapse all Sections
              </button>
            </div>

            <div className="mt-4">
              {courseDetails.courseContent.map((section, index) => (
                <CourseAccordionBar
                  course={section}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className="mx-auto box-content px-4 lg:w-[1260px] -mt-10 mb-10">
        <div className="mx-auto max-w-maxContentTab py-8 text-white lg:mx-0 lg:max-w-[810px]">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Author</h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={
                instructor.image
                  ? instructor.image
                  : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
              }
              alt={`profile-${instructor.firstName}`}
              className="h-14 w-14 rounded-full object-cover"
            />

            <div>
              <p className="text-lg font-medium">
                {instructor.firstName} {instructor.lastName}
              </p>
              <p className="text-richblack-50">
                {instructor.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseDetails;