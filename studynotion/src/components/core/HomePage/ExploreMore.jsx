import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );
  const [showMobileTabs, setShowMobileTabs] = useState(false);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
    setShowMobileTabs(false);
  };

  return (
    <div className=" max-w-maxContent mx-auto relative">
      {/* Explore more section */}
      <div className="mb-[50px] w-[90%] mx-auto">
        <div className="text-3xl lg:text-4xl font-semibold lg:text-center">
          Unlock the
          <HighlightText text={"Power of Code"} />
          <p className="lg:text-center text-richblack-300 text-lg font-semibold mt-1">
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="relative w-11/12">
        {/* Desktop Tabs */}
        <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
          {tabsName.map((ele, index) => {
            return (
              <div
                className={`text-[16px] flex flex-row items-center gap-2 ${
                  currentTab === ele
                    ? "bg-richblack-900 text-richblack-5 font-medium"
                    : "text-richblack-200"
                } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
                key={index}
                onClick={() => setMyCards(ele)}
              >
                {ele}
              </div>
            );
          })}
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex flex-col gap-2 items-center mb-8 ">
          {/* Mobile Dropdown Trigger */}
          <button
            onClick={() => setShowMobileTabs(!showMobileTabs)}
            className="w-full max-w-xs bg-richblack-800 text-richblack-5 py-2 px-4 rounded-full flex justify-between items-center relative z-20"
          >
            <span>{currentTab}</span>
            <svg
              className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                showMobileTabs ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Mobile Dropdown Menu - Now positioned absolutely above content */}
          {showMobileTabs && (
            <div className="fixed lg:hidden top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex gap-2 items-center justify-center">
              <div className="w-full max-w-xs bg-richblack-800 rounded-lg shadow-lg z-20 transform -translate-y-1/2">
                {tabsName.map((ele, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 cursor-pointer ${
                      currentTab === ele
                        ? "bg-richblack-700 text-yellow-50"
                        : "text-richblack-200 hover:bg-richblack-700"
                    } ${
                      index === 0 ? "rounded-t-lg" : ""
                    } ${
                      index === tabsName.length - 1 ? "rounded-b-lg" : ""
                    } transition-colors duration-200`}
                    onClick={() => setMyCards(ele)}
                  >
                    {ele}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Cards Group */}
      <div className="w-11/12 lg:w-[1200px] lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((ele, index) => {
          return (
            <CourseCard
              key={index}
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;