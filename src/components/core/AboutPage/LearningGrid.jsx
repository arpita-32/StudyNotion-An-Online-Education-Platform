import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import Button from '../HomePage/Button'

const LearningGrid = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='w-11/12 max-w-maxContent grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-12 md:mt-16 lg:mt-[80px]'>
        {/* Main Content */}
        <div className='w-full flex flex-col mx-auto lg:col-span-2 space-y-4 md:space-y-6'>
          <div className='text-3xl lg:text-4xl font-semibold leading-tight'>
            World-Class Learning for{' '}
            <HighlightText text="Anyone, Anywhere" />
          </div>

          <div>
            <p className='text-richblack-300 opacity-90 pb-4 md:pb-6 text-base md:text-[17px] font-medium'>
              Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">
            <Button active={true} linkto={"/signup"}>
              Learn More
            </Button>
          </div>
        </div>

        {/* Grid Items */}
        <div className='w-[300px] h-auto min-h-[200px] sm:h-[250px] lg:h-[280px] bg-richblack-700 flex flex-col mx-auto gap-4 p-6 mt-10 lg:mt-0'>
          <h1 className='text-lg sm:text-xl font-semibold'>Curriculum Based on Industry Needs</h1>
          <p className='text-richblack-300 opacity-90 text-sm sm:text-[15px] font-medium'>
            Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.
          </p>
        </div>

        <div className='w-[300px]  h-auto min-h-[200px] sm:h-[250px] lg:h-[280px] bg-richblack-800 flex flex-col gap-4 p-6 mx-auto'>
          <h1 className='text-lg sm:text-xl font-semibold'>Our Learning Methods</h1>
          <p className='text-richblack-300 opacity-90 text-sm sm:text-[15px] font-medium'>
            The learning process uses the namely online and offline.
          </p>
        </div>

        {/* Empty div for desktop layout */}
        <div className='hidden lg:block'></div>
        <div className='w-[300px]  h-auto min-h-[200px] sm:h-[250px] lg:h-[280px] bg-richblack-700 flex flex-col gap-4 p-6 mx-auto'>
          <h1 className='text-lg sm:text-xl font-semibold'>Certification</h1>
          <p className='text-richblack-300 opacity-90 text-sm sm:text-[15px] font-medium'>
            You will get a certificate that can be used as a certification during job hunting.
          </p>
        </div>

        <div className='w-[300px] h-auto min-h-[200px] sm:h-[250px] lg:h-[280px] bg-richblack-800 flex flex-col gap-4 p-6 mx-auto'>
          <h1 className='text-lg sm:text-xl font-semibold'>Rating "Auto-grading"</h1>
          <p className='text-richblack-300 opacity-90 text-sm sm:text-[15px] font-medium'>
            You will immediately get feedback during the learning process without having to wait for an answer or response from the mentor.
          </p>
        </div>

        <div className='w-[300px] h-auto min-h-[200px] sm:h-[250px] lg:h-[280px] bg-richblack-700 flex flex-col gap-4 p-6 mx-auto' >
          <h1 className='text-lg sm:text-xl font-semibold'>Ready to Work</h1>
          <p className='text-richblack-300 opacity-90 text-sm sm:text-[15px] font-medium'>
            Connected with over 150+ hiring partners, you will have the opportunity to find a job after graduating from our program.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LearningGrid