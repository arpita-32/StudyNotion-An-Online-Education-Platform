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
    <div>
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 items-center
       text-white justify-between max-w-maxContent'>

        <Link to={"/signup"}>
          <div className='mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 mt-10 p-1 hover:scale-95 w-fit group'>
            <div className=' flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                transition-all duration group-hover:bg-richblack-900'>
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className='lg:text-center text-3xl lg:text-4xl font-semibold mt-7 w-[90%]'>
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className='mt-4 lg:text-center text-lg font-bold text-richblack-300 w-[90%]'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world
          , and get access to wealth of resources. Including hands-on projects, quizzes, and
          personalized feedback from instructors.
        </div>

        <div className='flex flex-row gap-7 mt-8 ml-0 md:-ml-[43%] lg:ml-0'>
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a demo
          </CTAButton>
        </div>

        <div className='mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
          <video
            muted
            loop
            autoPlay
            className='w-[900px] h-[400px] shadow-[20px_20px_rgba(255,255,255)]'
          >
            <source src={Banner} type="video/mp4" />

          </video>
        </div>

        {/*  code-section 1 */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center justify-between'>
          <CodeBlocks
            position={"flex-col lg:flex-row"}
            heading={
              <div className='text-3xl lg:text-4xl font-semibold'>
                Unlock Your
                <HighlightText text={"coding potential"} />
                with our online courses
              </div>
            }
            subHeading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passoniate about sharing their knowledge with you"}

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


        {/*  code-section 2 */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center
       justify-between'>
          <CodeBlocks
            position={"flex-col lg:flex-row-reverse"}
            heading={
              <div className='text-3xl lg:text-4xl font-semibold'>
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

        <div className='homepage_bg h-[310px]'>

          <div className='w-11/12 max-w-maxContent flex items-center gap-5 mx-auto flex-col justify-between'>
            <div className='h-[150px]'></div>
            <div className='flex flex-col md:flex-row gap-7 text-white mt-[60px]'>
              <CTAButton active={true} linkto={"/signup"}>
                <div className='flex items-center gap-3'>
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

        <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
          <div className='w-full flex flex-col lg:flex-row gap-5 lg:gap-[100px] mt-[95px] mb-10 justify-center items-center'>
            <div className='text-3xl lg:text-4xl font-semibold w-[90%]'>
              Get the skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>


            <div className='flex flex-col gap-10 lg:items-start items-center w-[90%]'>
              <p className='text-[16px]'>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</p>
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

      <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8
       first-letter bg-richblack-900 text-white'>

        <InstructerSection />

        <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
          {/* Reviews from Other Learner */}
          <h1 className="lg:text-center text-3xl lg:text-4xl font-semibold mt-8">
            Reviews from other learners
          </h1>
          {/* <ReviewSlider /> */}
          <ReviewSlider />
        </div>


      </div>


      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
