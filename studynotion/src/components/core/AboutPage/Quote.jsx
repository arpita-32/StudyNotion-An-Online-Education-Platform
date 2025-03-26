import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div>
      <div className='relative'>
        <div className='h-[350px] py-5 pb-20 '>
          <div className='relative font-semibold text-2xl lg:text-4xl mx-auto lg:text-center w-[90%] mt-[70px] lg:mt-[140px]'>
            We are passionate about revolutionizing the way we learn. Our innovative platform
            <span className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text font-bold">
              {" "}
              combines techcnology,
            </span>

            <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
              {" "}
              expertise
            </span>
            , and community to create an
            <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
              {" "}
              unparalleled educational
              experience.
            </span>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Quote
