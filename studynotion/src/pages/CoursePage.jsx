import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowDown, MdOutlineLiveTv } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from "../components/common/ConfirmationModal";
import Footer from '../components/common/Footer';
import RatingStars from '../components/common/RatingStars';
import CourseBuyCard from '../components/core/CoursePage/CourseBuyCard';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import GetAvgRating from '../utils/avgRating';

const CoursePage = () => {

  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const [openSectionsArray, setOpenSectionsArray] = useState([]);

  const loadCourseDetails = async () => {  // Renamed function
    setLoading(true);
    try {
      const result = await fetchCourseDetails(courseId);
      if (!result) {
        console.log('No course found with this id');
        return;
      }
      console.log('result:- ', result);
      setCourse(result);
    } catch (err) {
      console.log('Error occurred while fetching course details: ', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadCourseDetails();
    }
  }, [courseId]);

  useEffect(() => {
    if (course) {
      const avgRating = GetAvgRating(course?.ratingAndReview);
      console.log(avgRating);
      setAvgReviewCount(avgRating);
    }
  }, [course]);

  if (loading) {
    return (<div className='h-full w-full flex justify-center items-center'><div className='loader'></div></div>);
  }

  const isOpen = (index) => openSectionsArray.includes(index);

  return (
    <>
      <div className='bg-richblack-800 flex flex-col items-start'>

        {/* Section 1 */}
        <div className='w-9/12 mx-auto relative text-white flex justify-between items-start py-24'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-bold'>{course?.courseName}</h1>
            <p className='text-richblack-300'>{course?.courseDescription}</p>
            <div className='flex gap-1'>
              <span className='text-yellow-50'>{avgReviewCount}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span>{`(${course?.ratingAndReview?.length} reviews)`}</span>
              <span>{`${course?.studentsEnrolled?.length} students enrolled`}</span>
            </div>
          </div>
          <div className='absolute w-[30%] h-fit p-4 bg-richblack-700 right-0 top-6'>
            <CourseBuyCard course={course} setConfirmationModal={setConfirmationModal} />
          </div>
        </div>

      </div>

      <div className='bg-richblack-900 w-9/12 mx-auto flex flex-col items-start my-5'>
        {/* Section 2 */}
        <div className='w-[65%] text-white flex flex-col gap-7'>
          <div className='flex flex-col gap-2 p-5 border border-richblack-500'>
            <h1 className='text-2xl font-semibold'>What you'll learn</h1>
            <p className='text-richblack-300'>{course?.whatYouWillLearn}</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h1 className='text-2xl font-semibold'>Course Content</h1>
            <div className='flex justify-between items-center'>
              <p>{`${course?.courseContent?.length} section(s) ${(course?.courseContent?.flatMap(section => section.subSection))?.length} lecture(s)`}</p>
              <div className='text-yellow-50 cursor-pointer' onClick={() => setOpenSectionsArray([])}>Collapse all sections</div>
            </div>
            
            <div>
              {course?.courseContent?.map((section, index) => (
                <details key={index} open={isOpen(index)} onClick={() => {
                  setOpenSectionsArray(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
                }}>
                  <summary className='flex px-4 py-3 gap-3 items-center cursor-pointer bg-richblack-600 justify-between'>
                    <div className='flex gap-2 items-center'>
                      <MdKeyboardArrowDown size={24} />
                      <span className='text-lg'>{section.sectionName}</span>
                    </div>
                    <div className='text-yellow-100'>{`${section?.subSection.length} lecture(s)`}</div>
                  </summary>

                  <div className='flex flex-col gap-2'>
                    {section?.subSection?.map((subSection, subIndex) => (
                      <div className='bg-richblack-900 px-4 py-3 flex-col gap-1' key={subIndex}>
                        <div className='flex gap-3' onClick={(e) => e.stopPropagation()}>
                          <MdOutlineLiveTv />
                          <p>{subSection?.title}</p>
                        </div>
                        <p className='text-richblack-300 mx-6'>{subSection?.subSectionDescription}</p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>

            {/* Author Section */}
            <div className='flex flex-col gap-4 mt-10'>
              <h1 className='text-2xl font-semibold'>Author</h1>
              <div className='flex flex-row gap-2 items-center'>
                <img className='h-9 w-9 rounded-full' src={course?.instructor?.image} alt='instructorImage' />
                <span className='text-lg text-richblack-25'>{`${course?.instructor?.firstName} ${course?.instructor?.lastName}`}</span>
              </div>
              <p className='text-richblack-5'>I will be leading this course with my utmost dedication and discipline...</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {confirmationModal && (
        <ConfirmationModal
          text1='You are not logged in'
          text2="Login to proceed"
          btn1Text='Login'
          btn1Handler={() => navigate('/login')}
          btn2Text='Cancel'
          btn2Handler={() => setConfirmationModal(false)}
        />
      )}
    </>
  );
}

export default CoursePage;
