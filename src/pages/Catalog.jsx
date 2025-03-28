import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/api'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import Course_Card from '../components/core/Catalog/Course_Card'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import { useSelector } from "react-redux"
import Error from "./Error"

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")

  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API)
      const category_id =
        res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id
      setCategoryId(category_id)
    }
    getCategories()
  }, [catalogName])

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogPageData(categoryId)
        setCatalogPageData(res)
      }
      catch (error) {
        console.log(error)
      }
    }
    if (categoryId) {
      getCategoryDetails()
    }
  }, [categoryId])

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="bg-richblack-800 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[180px] sm:min-h-[200px] md:min-h-[260px] max-w-[1200px] flex-col justify-center gap-2 sm:gap-3 md:gap-4 py-6 sm:py-8">
          <p className="text-xs sm:text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-richblack-200 max-w-[800px]">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-richblack-5 mb-3 sm:mb-4">
          Courses to get you started
        </h2>
        <div className="flex border-b border-b-richblack-600 text-xs sm:text-sm mb-4 sm:mb-6">
          <button
            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 ${active === 1
                ? "border-b-2 border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
              } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </button>
          <button
            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 ${active === 2
                ? "border-b-2 border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
              } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </button>
        </div>
        <CourseSlider
          Courses={catalogPageData?.data?.selectedCategory?.courses}
        />
      </div>

      {/* Section 2 */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-richblack-5 mb-3 sm:mb-4 md:mb-6">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </h2>
        <CourseSlider
          Courses={catalogPageData?.data?.differentCategory?.courses}
        />
      </div>

      {/* Section 3 */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-richblack-5 mb-3 sm:mb-4 md:mb-6">
          Frequently Bought
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {catalogPageData?.data?.mostSellingCourses
            ?.slice(0, 4)
            .map((course, i) => (
              <Course_Card
                course={course}
                key={i}
                Height={"h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"}
              />
            ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Catalog