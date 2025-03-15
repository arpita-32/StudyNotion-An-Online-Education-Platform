import React from 'react';
import { BsFillCaretRightFill } from 'react-icons/bs';
import { FaShareSquare } from 'react-icons/fa';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';



function CourseBuyCard({ course, setConfirmationModal, handleBuyCourse }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.courseName,
        url: window.location.href,
      });
    } else {
      copy(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add to cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => window.location.href = "/login",
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-lg">
      {/* Course Image */}
      <img
        src={course.thumbnail}
        alt={course.courseName}
        className="h-48 w-full rounded-lg object-cover"
      />

      <div className="px-4">
        <div className="space-x-3 pb-4 text-3xl font-semibold">
          Rs. {course.price}
        </div>
        
        
        
        <div className="flex flex-col gap-4">
          <button
            className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition"
            onClick={handleBuyCourse}
          >
            Buy Now
          </button>
          
          <button 
            onClick={handleAddToCart}
            className="w-full rounded-md border-2 border-blue-600 py-2 px-4 text-blue-600 hover:bg-blue-50 transition"
          >
            Add to Cart
          </button>
        </div>

        <p className="pb-3 pt-6 text-center text-sm text-gray-600">
          30-Day Money-Back Guarantee
        </p>

        <div>
          <p className="my-2 text-xl font-semibold">
            This Course Includes:
          </p>
          <div className="flex flex-col gap-3 text-sm text-gray-600">
            {course.instructions?.map((item, i) => (
              <p className="flex items-center gap-2" key={i}>
                <BsFillCaretRightFill className="text-blue-600" />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-6 text-blue-600 hover:text-blue-700"
            onClick={handleShare}
          >
            <FaShareSquare size={15} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseBuyCard;