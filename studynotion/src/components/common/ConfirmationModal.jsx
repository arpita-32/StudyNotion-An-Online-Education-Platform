import React from 'react';
import IconBtn from './IconBtn';

const ConfirmationModal = ({ modalData }) => {
  return (
    <div className='absolute inset-0 flex items-center justify-center z-10'>
      {/* Blurred background */}
      <div className='absolute inset-0 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-sm'></div>
      
      {/* Confirmation modal */}
      <div className='relative'>
        <div className='min-h-[160px] max-w-[340px] bg-richblack-900 px-4 py-4 border-[1px] border-richblack-100 border-opacity-30 rounded-md space-y-4'>
          <div>
            <p className='text-[1.25rem] text-white font-bold mb-2'>{modalData.text1}</p>
            <p className='text-[0.9rem] text-richblack-50'>{modalData.text2}</p>
          </div>
          <div className='flex flex-row gap-3'>
            <button onClick={modalData?.btn1Handler} className='bg-yellow-50 text-black font-bold w-[90px] rounded-md h-9'>{modalData?.btn1Text}</button>
          
            <button onClick={modalData?.btn2Handler} className='bg-richblack-200 text-black font-bold w-[90px] rounded-md'>
              {modalData?.btn2Text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
