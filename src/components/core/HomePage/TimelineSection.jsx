import React from "react";
import TimeLineImage from "../../../assets/Images/TimelineImage.png"
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";

const timeLine = [
  {
    Logo: Logo1,
    Heading: "Leadership",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo2,
    Heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    Heading: "Flexibility",
    Description: "The ability to switch is an important skills",
  },

];

const TimelineSection = () => {
  return (
    <div>
      <div className='flex flex-col lg:flex-row gap-[100px] items-center'>

        <div className="w-[45%] flex flex-col gap-[60px]">
          {
            timeLine.map((element, index) => {
              return (
                <div className="flex flex-row gap-6" key={index}>

                  <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                    <img src={element.Logo} className="gap-[100px]"></img>
                    <div className="h-11 border-r border-dotted border-richblack-100 absolute -mb-[40px] mt-[70px] gap-2"></div>

                  </div>

                  <div>
                    <h2 className="font-semibold text-[18px]">{element.Heading}</h2>
                    <p className="text-base">{element.Description}</p>
                  </div>
                </div>
              )
            })
          }
          <div className="flex flex-row gap-6">
            <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
              <img src={Logo4} alt="logo" className="gap-[100px]"></img>
            </div>

            <div>
              <h2 className="font-semibold text-[18px]">Solve the problem</h2>
              <p className="text-base">Code your way to a solution</p>
            </div>
          </div>
        </div>

        <div>
          <div className="relative shadow-blue-200  shadow-[0px_0px_30px_0px]">
            <img src={TimeLineImage}
              alt="timeline"
              className="shadow-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] object-cover h-[400px] lg:h-fit relative">
            </img>

            <div className="absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7
             left-[50%] translate-x-[-50%] translate-y-[-50%]">

              <div className="flex flex-row gap-5 items-center  px-7">
                <p className="text-3xl font-bold">10</p>
                <p className="text-caribbeangreen-300 text-sm">Years of Experience</p>
              </div>
              <div className="h-9 w-[3px] bg-pure-greys-500"></div>
              <div className="flex gap-5 items-center px-7">
                <p className="text-3xl font-bold">50</p>
                <p className="text-caribbeangreen-300 text-sm">Types of courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineSection
