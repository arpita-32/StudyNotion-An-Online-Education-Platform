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
  const [totalNoOfLectures, setTotalNoOfLectures] = useState("");
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
        console.log("Printing course Details: ", result);
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
    return <div className="spinner"></div>;
  }

  if (!courses?.success) {
    return <Error />;
  }

  const courseDetails = courses.data.courseDetails;
  const instructor = courseDetails.instructor || {};

  return (
    <div className="relative">
      <div className="w-full h-[430px] bg-richblack-800 relative flex justify-start">
        <div className="text-white ml-[80px] pt-[90px]">
          <div className="space-y-3">
            <p className="font-bold text-[2.75rem]">
              {courseDetails.courseName}
            </p>
            <p className="text-richblack-200 text-[1.25rem]">
              {courseDetails.courseDescription}
            </p>

            <div className="flex flex-row gap-2 text-[1.15rem]">
              <span className="text-yellow-50">{avgReviewCount || 0}</span>
              <span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={25} />
              </span>
              <p>
                ({courseDetails.ratingAndReviews.length} reviews)
              </p>
              <p>
                {courseDetails.studentsEnrolled.length} students enrolled
              </p>
            </div>

            <p className="text-[1.15rem]">
              Created By {instructor.firstName} {instructor.lastName}
            </p>
            <div className="flex space-x-6 text-[1.15rem]">
              <p className="flex gap-1">
                <AiTwotoneClockCircle className="text-[1.25rem] mt-1" />
                Created at {formatDate(courseDetails.createdAt)}
              </p>
              <p className="flex gap-1">
                <MdLanguage className="text-[1.25rem] mt-1" />
                English
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-richblack-700 min-h-[600px] rounded-md px-8 py-4 w-[430px]
        -mt-[380px] right-[1rem] mx-auto absolute mr-[40px]"
      >
        <CourseDetailsCard
          setConfirmationModal={setConfirmationModal}
          course={courseDetails}
          handleBuyCourse={handleBuyCourse}
        />
      </div>

      <div className="text-white ml-[70px] mt-[30px] px-5 py-5 w-[56%] border-[1px] border-richblack-500 space-y-3">
        <h1 className="font-bold text-[1.8rem]">What You'll Learn</h1>
        <p className="text-[1.15rem]">
          {courseDetails.whatYouWillLearn}
        </p>
      </div>

      <div className="text-white ml-[50px] mt-[20px] px-5 py-5 w-[56%] space-y-3">
        <h1 className="font-bold text-[1.8rem]">Course Content</h1>

        <div>
          <div className="text-[1rem] flex flex-row justify-between">
            <div className="flex space-x-2">
              <p>{courseDetails.courseContent.length} Sections(s)</p>
              <p>{totalNoOfLectures} Lecture(s)</p>
              <p>{courses.data.totalDuration} total length</p>
            </div>

            <button onClick={() => setIsActive([])} className="text-yellow-25">
              Collapse all Sections
            </button>
          </div>

          <div className="py-4">
            {courseDetails.courseContent.map((section, index) => (
              <CourseAccordionBar
                course={section}
                key={index}
                isActive={isActive}
                handleActive={handleActive}
              />
            ))}
          </div>

          <div className="space-y-3 mb-12 mt-5">
            <h1 className="font-bold text-[2rem]">Author</h1>
            <div className="flex">
              <img
                src={
                  instructor.image
                    ? instructor.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                }
                alt={`profile-${instructor.firstName}`}
                className="aspect-square w-14 h-14 rounded-full object-cover"
              />

              <p className="text-[1.15rem] py-4 ml-3">
                {instructor.firstName} {instructor.lastName}
              </p>
              <p>
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
