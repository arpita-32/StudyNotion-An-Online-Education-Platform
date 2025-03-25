import { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import CourseSubSectionAccordion from "./CourseSubSectionAccordion";

export default function CourseAccordionBar({ 
  course, 
  isActive = [],  // Default to empty array
  handleActive 
}) {
  const contentEl = useRef(null);
  const [active, setActive] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);

  // Ensure isActive is always treated as an array
  const activeArray = Array.isArray(isActive) ? isActive : [];

  // Safe course data with defaults
  const safeCourse = {
    _id: course?._id || '',
    sectionName: course?.sectionName || 'Untitled Section',
    subSection: course?.subSection || []
  };

  // Check if current course is active
  useEffect(() => {
    setActive(activeArray.includes(safeCourse._id));
  }, [activeArray, safeCourse._id]);

  // Calculate section height
  useEffect(() => {
    if (active && contentEl.current) {
      setSectionHeight(contentEl.current.scrollHeight);
    } else {
      setSectionHeight(0);
    }
  }, [active]);

  if (!course) {
    return (
      <div className="border border-solid border-richblack-600 bg-richblack-700 p-4 text-richblack-5">
        <p>Section data not available</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
      <div>
        <div
          className={`flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]`}
          onClick={() => handleActive(safeCourse._id)}
        >
          <div className="flex items-center gap-2">
            <i className={active ? "rotate-180" : "rotate-0"}>
              <AiOutlineDown />
            </i>
            <p>{safeCourse.sectionName}</p>
          </div>
          <div className="space-x-4">
            <span className="text-yellow-25">
              {`${safeCourse.subSection.length} lecture(s)`}
            </span>
          </div>
        </div>
      </div>
      <div
        ref={contentEl}
        className={`relative overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]`}
        style={{ height: `${sectionHeight}px` }}
      >
        <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
          {safeCourse.subSection.map((subSec, i) => (
            <CourseSubSectionAccordion 
              subSec={subSec} 
              key={subSec._id || i} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}