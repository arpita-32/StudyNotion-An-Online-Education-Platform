import React from 'react'
import ContactDetails from '../components/core/ContactPage/ContactDetails'
import ContactForm from '../components/core/ContactPage/ContactForm'
import ReviewSlider from '../components/common/ReviewSlider'
import Footer from '../components/common/Footer'

const ContactUs = () => {
  return (
    <div className='overflow-x-hidden'>
      <div className='w-11/12 max-w-maxContent mx-auto flex flex-col lg:flex-row gap-8 md:gap-10 justify-center mt-12 md:mt-16 lg:mt-[80px] px-4'>
        <ContactDetails />
        <ContactForm />
      </div>

      <div className="w-11/12 max-w-maxContent mx-auto my-12 md:my-16 lg:my-20 flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white px-4 py-8 rounded-lg">
        <h1 className="text-center text-3xl lg:text-4xl font-semibold">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      <Footer />
    </div>
  )
}

export default ContactUs