import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import { FaArrowRight } from 'react-icons/fa'
import CTAButton from "./Button"

const InstructerSection = () => {
  return (
    
      <div className='mt-24 flex flex-col lg:flex-row gap-20 lg:ml-24 items-center justify-evenly mx-auto'>

        <div className='mx-auto w-[85%] lg:w-[50%]'>
          <img src={Instructor} alt='instructor'
            className='shadow-white shadow-[-20px_-20px_0_0]' />
        </div>

        <div className=' flex flex-col gap-10 w-[90%]'>
          <div className='text-3xl lg:text-4xl font-semibold'>
            Become an
            <HighlightText text={"Instructor"} />
          </div>

          <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          <div className='w-fit'>
            <CTAButton active={true} linkto={"/signup"}>
              <div className='flex flex-row gap-2 items-center'>
                Start Teaching Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>

        </div>
      </div>

  )
}

export default InstructerSection
