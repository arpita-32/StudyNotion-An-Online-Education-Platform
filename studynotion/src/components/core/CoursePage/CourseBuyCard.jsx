import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import toast from 'react-hot-toast';
import { FaShareSquare } from "react-icons/fa";
import { MdArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../slices/cartSlice';


const CourseBuyCard = ({course,setConfirmationModal}) => {


  const {token} = useSelector((state)=> state.auth);
  const {user} = useSelector((state)=> state.profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {cart} = useSelector((state)=>state.cart);


  const handleBuyCourse = async () => {
    console.log("Buying Course:", course);

    if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
        console.error("❌ Stripe Publishable Key is missing in .env file");
        toast.error("Stripe configuration error.");
        return;
    }

    if (token && user?.accountType === "Student") {
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
            console.error("❌ Failed to initialize Stripe");
            toast.error("Payment system error.");
            return;
        }

        const body = {
            products: [{ ...course }],
            userId: user._id,
        };

        const apiUrl = `${process.env.REACT_APP_BASE_URL}/payment/create-checkout-session`;
        console.log("Sending Request to:", apiUrl);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            console.log("Raw Response:", response);

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const session = await response.json();
            console.log("Received Stripe Session:", session);

            if (session.id) {
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                if (result.error) {
                    console.error(result.error);
                    toast.error("Payment failed.");
                }
            } else {
                console.error("❌ Session ID is missing in API response");
                toast.error("Payment session could not be created.");
            }
        } catch (error) {
            console.error("❌ Error processing payment:", error);
            toast.error("Payment request failed.");
        }
    } else {
        setConfirmationModal(true);
    }
};

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to your clipboard')
  }

  const addToCartHandler = () => {
    if(user && user.accountType === 'Student'){
        dispatch(addToCart(course))
    }
    else{
        toast.error("Only student are allowed to buy courses")
    }
  }

  return (
    <div className='text-white flex flex-col gap-2'>
        <div className='flex flex-col gap-2'>
            <img src={course?.thumbnail} alt='courseImg' className='rounded-lg'/>
            <h1 className='self-start text-2xl font-bold' >{`Rs. ${course?.price}`}</h1>
        </div>
        <div className='flex flex-col gap-3'>
            <button  className='bg-yellow-50 w-full text-black  py-2 px-4 rounded-md' 
            onClick={
                user && course?.studentsEnrolled?.includes(user?._id) ? () => {navigate('/dashboard/enrolled-courses')}  : handleBuyCourse
            } >
                {
                    user && course?.studentsEnrolled?.includes(user?._id) ? 'Go to Course' : 'Buy Now'
                }
            </button>
               {
                 user && course?.studentsEnrolled?.includes(user?._id) ? null :
                 
                    cart?.find((courseInCart) => courseInCart?._id === course?._id) ? (<button onClick={() => {navigate('/dashboard/cart')}} className='bg-richblack-800 rounded-md w-full px-3 py-2'>View in Cart</button>) : (<button onClick={addToCartHandler} className='bg-richblack-800 rounded-md w-full px-3 py-2'>Add to Cart</button>)
                 
               }
        </div>
        <p className='self-center text-richblack-300'>30 Days Money Back Guarentee</p>
        <div>
            <h2 className='text-lg '>This Course Includes:- </h2>
            <ul className='text-caribbeangreen-200 flex flex-col gap-2'>
                <li className='flex gap-1 items-center'><MdArrowRight /><span>8 hours of lectures</span></li>
                <li className='flex gap-1 items-center'><MdArrowRight /><span>End to end projects</span></li>
            </ul>
        </div>

        
            <button className='mt-3 flex gap-3 items-center text-yellow-100 justify-center ' onClick={handleShare}>
            <FaShareSquare />
                <span>Share</span>
            </button>
        
    </div>
  )
}

export default CourseBuyCard