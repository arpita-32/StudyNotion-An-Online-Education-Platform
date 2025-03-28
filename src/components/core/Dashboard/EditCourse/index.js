import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import RenderSteps from '../AddCourse/RenderSteps';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';
import { useDispatch } from 'react-redux';

const EditCourse = () => {

  const dispatch = useDispatch();
  const {courseId} = useParams();
  const {course} = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((state) => state.auth);

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token)
      if(result?.courseDetails){
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    }
    populateCourseDetails();
  }, [])

  if(loading){
    return (
      <div className='spinner'/>
    )
  }

  return (
    <div>
      <h1 className='mb-14 text-3xl font-medium text-richblack-5'>Edit Course</h1>
      {
        course ? (<RenderSteps/>) : (<p className = "text-white flex mx-auto text-3xl mt-[200px]">No courses Found</p>)
      }
    </div>
  )
}

export default EditCourse
