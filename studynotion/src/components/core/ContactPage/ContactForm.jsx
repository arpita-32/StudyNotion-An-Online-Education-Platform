import React from 'react'
import ContactUsForm from './ContactUsForm'

const ContactForm = () => {
  return (
    <div className='w-full lg:w-auto'>
      <div className='mx-auto flex flex-col justify-between w-full lg:w-[550px] border border-richblack-25 border-opacity-20 rounded-xl p-5 md:p-7'>
        <div className='flex flex-col items-center mb-8 md:mb-14 text-center'>
          <h1 className='font-semibold text-xl md:text-2xl lg:text-[1.75rem] text-white mb-2'>
            Got a Idea? We've got the skills. Let's team up
          </h1>
          <p className='text-sm text-richblack-300'>
            Tell us more about yourself and what you've got in mind.
          </p>
        </div>
        <div>
          <ContactUsForm />
        </div>
      </div>
    </div>
  )
}

export default ContactForm