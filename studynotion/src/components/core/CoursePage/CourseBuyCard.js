import React from 'react';
import { MdArrowRight } from "react-icons/md";
import { FaShareSquare } from 'react-icons/fa';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { addToCart } from '../../../slices/cartSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CourseBuyCard = ({ course, setConfirmationModal, handleBuyCourse }) => {
  // Access user and token from the Redux store
  const { user } = useSelector((state) => state.profile); // Ensure this matches your Redux state structure
  const { token } = useSelector((state) => state.auth); // Ensure this matches your Redux state structure
  const { cart } = useSelector((state) => state.cart); // Ensure this matches your Redux state structure

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add to cart handler
  const addToCartHandler = () => {
    if (user && user.accountType === 'Student') {
      dispatch(addToCart(course));
      toast.success('Course added to cart!');
    } else {
      toast.error('Only students are allowed to buy courses');
    }
  };

  // Share course handler
  const handleShare = () => {
    const courseLink = window.location.href;
    copy(courseLink);
    toast.success('Course link copied to clipboard!');
  };

  return (
    <div className='text-white flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <img src={course?.thumbnail} alt='courseImg' className='rounded-lg' />
        <h1 className='self-start text-2xl font-bold'>{`Rs. ${course?.price}`}</h1>
      </div>
      <div className='flex flex-col gap-3'>
        <button
          className='bg-yellow-50 w-full text-black py-2 px-4 rounded-md'
          onClick={
            user && course?.studentsEnrolled?.includes(user?._id)
              ? () => navigate('/dashboard/enrolled-courses')
              : handleBuyCourse
          }
        >
          {user && course?.studentsEnrolled?.includes(user?._id)
            ? 'Go to Course'
            : 'Buy Now'}
        </button>
        {user && course?.studentsEnrolled?.includes(user?._id) ? null : (
          cart?.find((courseInCart) => courseInCart?._id === course?._id) ? (
            <button
              onClick={() => navigate('/dashboard/cart')}
              className='bg-richblack-800 rounded-md w-full px-3 py-2'
            >
              View in Cart
            </button>
          ) : (
            <button
              onClick={addToCartHandler}
              className='bg-richblack-800 rounded-md w-full px-3 py-2'
            >
              Add to Cart
            </button>
          )
        )}
      </div>
      <p className='self-center text-richblack-300'>30 Days Money Back Guarantee</p>
      <div>
        <h2 className='text-lg'>This Course Includes:- </h2>
        <ul className='text-caribbeangreen-200 flex flex-col gap-2'>
          <li className='flex gap-1 items-center'>
            <MdArrowRight />
            <span>8 hours of lectures</span>
          </li>
          <li className='flex gap-1 items-center'>
            <MdArrowRight />
            <span>End to end projects</span>
          </li>
        </ul>
      </div>
      <button
        className='mt-3 flex gap-3 items-center text-yellow-100 justify-center'
        onClick={handleShare}
      >
        <FaShareSquare />
        <span>Share</span>
      </button>
    </div>
  );
};

export default CourseBuyCard;