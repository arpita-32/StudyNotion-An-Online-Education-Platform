import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";
import { GoTriangleRight } from "react-icons/go";
import { FaShareSquare } from "react-icons/fa";

const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an instructor , you can't buy a course");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      navigate("/dashboard/cart");
    }
    setConfirmationModal({
      text1: "You are not Logged in",
      text2: "Please login to add to cart",
      btn1Text: "Login",
      btn1Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };

  return (
    <div className="space-y-3">
      <img src={course?.thumbnail} alt="Thumbnail Image" className="w-full" />
      <div className="space-x-3 pb-4 text-3xl font-semibold text-white">
        Rs. {course?.price}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={
            user &&
            !(user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) &&
            course?.studentsEnrolled.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
          className="flex bg-yellow-50 h-[40px] rounded-md items-center 
          justify-center font-semibold"
        >
          {user && course?.studentsEnrolled.includes(user?._id)
            ? "Go to Course"
            : "Buy Now"}
        </button>

        {!course?.studentsEnrolled.includes(user?._id) && (
          <button
            onClick={handleAddToCart}
            className="flex bg-richblack-800 h-[40px] rounded-md items-center 
            justify-center font-semibold text-white mb-2"
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
            {course?.instructions?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex text-caribbeangreen-100 text-[1rem] "
                >
                  <GoTriangleRight className="mt-1" />
                  {item}
                </div>
              );
            })}
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
