import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import image1 from "../assets/Images/aboutus1.webp"
import image2 from "../assets/Images/aboutus2.webp"
import image3 from "../assets/Images/aboutus3.webp"
import Quote from '../components/core/AboutPage/Quote'
import image4 from "../assets/Images/FoundingStory.png"
import Stats from '../components/core/AboutPage/Stats'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import ReviewSlider from '../components/common/ReviewSlider'
import Footer from '../components/common/Footer'

const AboutUs = () => {
  return (
    <div className="overflow-x-hidden">
      <div className="relative mx-auto flex flex-col items-center text-white w-11/12 max-w-maxContent">
        {/* first-section */}
        <div className='bg-richblack-700 h-[300px] md:h-[400px] lg:h-[500px] w-screen'>
          {/* heading */}
          <div className='flex flex-col items-center justify-center mt-12 md:mt-16 lg:mt-[90px] gap-3 w-[85%] mx-auto lg:text-center'>
            <div className='font-semibold text-3xl lg:text-4xl text-white'>
              Driving Innovation in Online Education for a
              <HighlightText text="Brighter Future"/>
            </div>
            <div className='text-richblack-200 opacity-90 text-sm md:text-base'>
              Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
            </div>
          </div>
        </div>

        {/* images */}
        <div className='relative lg:absolute grid grid-cols-3 gap-3 sm:gap-5 md:gap-8 lg:gap-10 mt-20 sm:mt-30 lg:mt-[290px] justify-center items-center px-4'>
          <img src={image1} className='w-full h-auto max-w-[200px] md:max-w-none' alt="about us 1"/>
          <img src={image2} className='w-full h-auto max-w-[200px] md:max-w-none' alt="about us 2"/>
          <img src={image3} className='w-full h-auto max-w-[200px] md:max-w-none' alt="about us 3"/>
        </div>

        <Quote/>

        {/* thin line */}
        <div className='mt-[10px] bg-richblack-400 h-[1px] w-screen opacity-30'></div>

        {/* our founding section */}
          <div className='relative flex flex-col lg:flex-row mx-auto gap-8 lg:gap-15 justify-between items-center mt-16 md:mt-20 lg:mt-[90px] px-4'>
            <div className='w-full lg:w-[50%] gap-6 md:gap-10 flex flex-col'>
              <div className='bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-3xl lg:text-4xl font-semibold text-transparent'>
                Our Founding Story
              </div>
              <div className='text-richblack-200 opacity-90 flex flex-col gap-4 md:gap-6 lg:gap-10 text-sm md:text-base'>
                <p>
                  Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world. 
                </p>
                <p>
                  As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                </p>
              </div>
            </div>

            <img 
              src={image4} 
              className='w-full lg:w-auto max-w-[500px] mt-8 lg:mt-0 shadow-[0_0_20px_0] shadow-[#FC6767]' 
              alt="Founding Story"
            />
          </div>
   

   
          <div className='flex flex-col lg:flex-row gap-10 mt-16 md:mt-24 lg:mt-[200px] justify-between mx-auto px-4'>
            <div className='flex flex-col gap-6 md:gap-8 lg:gap-10 w-full lg:w-[40%]'>
              <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold text-3xl lg:text-4xl">
                Our Vision
              </span>
              <p className='text-richblack-200 opacity-90 text-sm md:text-base'>
                With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
              </p>
            </div>

            <div className='flex flex-col gap-6 md:gap-8 lg:gap-10 w-full lg:w-[40%]'>
              <HighlightText text={"Our Mission"}/>
              <p className='text-richblack-200 opacity-90 text-sm md:text-base'>
                Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>


        <Stats/>

        <LearningGrid/>

        <ContactFormSection/>

        <div className="relative mx-auto my-12 md:my-16 lg:my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-6 md:gap-8 bg-richblack-900 text-white px-4">
          {/* Reviews from Other Learner */}
          <h1 className="text-center text-3xl lg:text-4xl font-semibold mt-6 md:mt-8">
            Reviews from other learners
          </h1>
          <ReviewSlider />
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default AboutUs