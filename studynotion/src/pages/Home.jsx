import React from 'react'
import { FaArrowRight } from "react-icons/fa"
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from "../components/core/HomePage/Button"
import { Link } from 'react-router-dom'
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import '../App.css'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructerSection from "../components/core/HomePage/InstructerSection"
import Footer from "../components/common/Footer"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import ReviewSlider from '../components/common/ReviewSlider'

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent'>

        <Link to={"/signup"}>
          <div className='mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 mt-6 sm:mt-8 md:mt-10 p-1 hover:scale-95 w-fit group'>
            <div className='flex flex-row items-center gap-2 rounded-full px-6 sm:px-8 md:px-10 py-1 sm:py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
              <p className="text-xs sm:text-sm md:text-base">Become an Instructor</p>
              <FaArrowRight className="text-xs sm:text-sm" />
            </div>
          </div>
        </Link>

        <div className='text-center text-2xl sm:text-3xl md:text-4xl font-semibold mt-5 sm:mt-7 w-[90%]'>
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className='mt-3 sm:mt-4 text-center text-sm sm:text-base md:text-lg font-bold text-richblack-300 w-[90%]'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to wealth of resources.
        </div>

        <div className='flex flex-col sm:flex-row gap-4 sm:gap-7 mt-6 sm:mt-8 ml-0 md:-ml-[43%] lg:ml-0'>
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a demo
          </CTAButton>
        </div>

        <div className='mx-3 my-8 sm:my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
          <video
            muted
            loop
            autoPlay
            className='w-full max-w-[900px] h-auto aspect-video shadow-[10px_10px_rgba(255,255,255)] sm:shadow-[20px_20px_rgba(255,255,255)]'
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Section 1 */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center justify-between'>
          <CodeBlocks
            position={"flex-col lg:flex-row"}
            heading={
              <div className='text-2xl sm:text-3xl md:text-4xl font-semibold'>
                Unlock Your
                <HighlightText text={"coding potential"} />
                with our online courses
              </div>
            }
            subHeading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you"}
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: false
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: true
            }}
            codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>\n</html>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center justify-between'>
          <CodeBlocks
            position={"flex-col lg:flex-row-reverse"}
            heading={
              <div className='text-2xl sm:text-3xl md:text-4xl font-semibold'>
                Start
                <HighlightText text={"coding"} />
                in seconds
              </div>
            }
            subHeading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false
            }}
            codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>\n</html>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
        <ExploreMore />
      </div>

      {/* Section 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='homepage_bg h-[200px] sm:h-[250px] md:h-[310px]'>
          <div className='w-11/12 max-w-maxContent flex items-center gap-5 mx-auto flex-col justify-between'>
            <div className='h-[80px] sm:h-[120px] md:h-[150px]'></div>
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-7 text-white mt-[30px] sm:mt-[60px]'>
              <CTAButton active={true} linkto={"/signup"}>
                <div className='flex items-center gap-2 sm:gap-3 text-sm sm:text-base'>
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 py-8 sm:py-12'>
          <div className='w-full flex flex-col lg:flex-row gap-5 lg:gap-[100px] mt-8 sm:mt-[95px] mb-6 sm:mb-10 justify-center items-center'>
            <div className='text-2xl sm:text-3xl md:text-4xl font-semibold w-[90%] text-center lg:text-left'>
              Get the skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>
            <div className='flex flex-col gap-6 sm:gap-10 lg:items-start items-center w-[90%]'>
              <p className='text-sm sm:text-base md:text-[16px] text-center lg:text-left'>
                The modern StudyNotion dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
              </p>
              <CTAButton active={true} linkto={"/signup"}>
                Learn more
              </CTAButton>
            </div>
          </div>

          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white py-8 sm:py-12'>
        <InstructerSection />
        <div className="relative mx-auto my-12 sm:my-16 md:my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-6 sm:gap-8 bg-richblack-900 text-white">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold">
            Reviews from other learners
          </h1>
          <ReviewSlider />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home