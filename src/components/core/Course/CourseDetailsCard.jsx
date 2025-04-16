import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";
import { GoTriangleRight } from "react-icons/go";
import { FaShareSquare } from "react-icons/fa";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
  paymentProcessing,
}) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an instructor, you can't buy a course");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      navigate("/dashboard/cart");
    } else {
      setConfirmationModal({
        text1: "You are not Logged in",
        text2: "Please login to add to cart",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please try again.");
      return;
    }

    await handleBuyCourse();
  };

  return (
    <div className="space-y-3">
      <img src={course?.thumbnail} alt="Thumbnail Image" className="w-full" />
      <div className="space-x-3 pb-4 text-3xl font-semibold text-white">
        Rs. {course?.price}
      </div>

      <div className="flex flex-col gap-3">
        {/* Show payment form only if user is not enrolled */}
        {!(user && course?.studentsEnrolled.includes(user?._id)) && (
          <div className="p-3 border border-richblack-300 rounded-md">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    backgroundColor: '#2C333F',
                  },
                  invalid: {
                    color: '#fa755a',
                  },
                },
              }}
            />
          </div>
        )}

        <button
          onClick={
            user && course?.studentsEnrolled.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handlePayment
          }
          disabled={paymentProcessing || (user && !course?.studentsEnrolled.includes(user?._id) && !stripe)}
          className={`flex bg-yellow-50 h-[40px] rounded-md items-center justify-center font-semibold ${
            paymentProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {paymentProcessing
            ? "Processing..."
            : user && course?.studentsEnrolled.includes(user?._id)
            ? "Go to Course"
            : "Buy Now"}
        </button>

        {!(user && course?.studentsEnrolled.includes(user?._id)) && (
          <button
            onClick={handleAddToCart}
            disabled={paymentProcessing}
            className={`flex bg-richblack-800 h-[40px] rounded-md items-center justify-center font-semibold text-white mb-2 ${
              paymentProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Add to Cart
          </button>
        )}

        <div>
          <p className="text-richblack-50 flex items-center justify-center text-[0.9rem]">
            30-Day Money-Back Guarantee
          </p>
          <p className="text-richblack-5 text-[1.35rem] font-bold mt-3 ">
            This course includes:
          </p>
          <div className="flex flex-col gap-3 mt-2">
            {course?.instructions?.map((item, index) => (
              <div
                key={index}
                className="flex text-caribbeangreen-100 text-[1rem]"
              >
                <GoTriangleRight className="mt-1" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={handleShare}
          className="mt-1 text-yellow-100 text-[1rem] flex flex-row gap-2 mx-auto mb-4"
        >
          <FaShareSquare className="mt-1" />
          Share
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;