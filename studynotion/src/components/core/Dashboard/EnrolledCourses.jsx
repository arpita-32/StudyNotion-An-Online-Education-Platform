import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
// In EnrolledCourses.jsx, update the getEnrolledCourses function:

const getEnrolledCourses = async () => {
  try {
    setLoading(true)
    setError(null)
    
    if (!token) {
      navigate('/login')
      return
    }

    const courses = await getUserEnrolledCourses(token)
    console.log("API returned courses:", courses) // Add this line
    
    if (courses === null) {
      return
    }
    
    setEnrolledCourses(courses)
  } catch (error) {
    console.error("Error fetching enrolled courses:", error)
    setError("Failed to load enrolled courses")
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    if (token) {
      getEnrolledCourses()
    } else {
      navigate('/login')
    }
  }, [token, navigate])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="loader"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <p className="text-richblack-5">{error}</p>
      </div>
    )
  }

  if (!enrolledCourses?.length) {
    return (
      <div>
        <h2 className="text-3xl text-richblack-50 mb-8">Enrolled Courses</h2>
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl text-richblack-50 mb-8">Enrolled Courses</h2>
      <div className="my-8 text-richblack-5">
        <div className="flex rounded-t-lg bg-richblack-500">
          <p className="w-[45%] px-5 py-3">Course Name</p>
          <p className="w-1/4 px-2 py-3">Duration</p>
          <p className="flex-1 px-2 py-3">Progress</p>
        </div>
        
        {enrolledCourses.map((course, i, arr) => (
          <div
            className={`flex items-center border border-richblack-700 ${
              i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
            }`}
            key={course._id}
          >
            <div
              className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
              onClick={() => {
                navigate(
                  `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                )
              }}
            >
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="flex max-w-xs flex-col gap-2">
                <p className="font-semibold">{course.courseName}</p>
                <p className="text-xs text-richblack-300">
                  {course.courseDescription.length > 50
                    ? `${course.courseDescription.slice(0, 50)}...`
                    : course.courseDescription}
                </p>
              </div>
            </div>
            <div className="w-1/4 px-2 py-3">{course?.totalDuration || 'N/A'}</div>
            <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
              <p>Progress: {course.progressPercentage || 0}%</p>
              <ProgressBar
                completed={course.progressPercentage || 0}
                height="8px"
                isLabelVisible={false}
                bgColor="#6b7280"
                baseBgColor="#374151"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}