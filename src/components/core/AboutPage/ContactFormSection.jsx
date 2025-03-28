import React from 'react'
import ContactUsForm from "../ContactPage/ContactUsForm"

const ContactFormSection = () => {
  return (
    <div className='mx-auto flex flex-col justify-between mt-[150px] w-full lg:w-[550px] border border-richblack-25 border-opacity-20 rounded-xl p-7'>
    <div className='flex flex-col items-center mb-14'>
    <h1 className='font-semibold text-[1.75rem]'>
        Get in Touch
       </h1>
       <p className='text-sm text-richblack-300'>
        We'd love to here for you, Please fill out this form.
       </p>
    </div>
       <div>
        <ContactUsForm/>
       </div>
    </div>
  )
}

export default ContactFormSection
