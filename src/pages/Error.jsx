import React from 'react'
import FuzzyText from '../components/common/FuzzyText'

const Error = () => {
  return (
    <div className='flex justify-center items-center text-richblack-25 mt-[40vh]'>
      <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={0.5}
        enableHover={true}
        fontSize="clamp(2rem, 5vw, 6rem)"
      >
        404- Not Found
      </FuzzyText>
    </div>
  )
}

export default Error
