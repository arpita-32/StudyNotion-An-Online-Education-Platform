import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="w-11/12 max-w-maxContent mx-auto py-14">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row gap-8 pb-5 border-b border-richblack-700">
          {/* Section 1 - Left Side - Now 2 columns on mobile */}
          <div className="lg:w-[50%] flex flex-row flex-wrap justify-between text-richblack-200 font-thin text-opacity-70 lg:border-r lg:border-richblack-700 lg:pr-5 gap-y-7">
            {/* Company Column */}
            <div className="w-[48%] lg:w-[30%] mt-6 lg:mt-0">
              <img src={Logo} alt="" className="object-contain w-[160px] mb-6" />
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-2">
                Company
              </h1>
              <div className="flex flex-col gap-2 mb-4">
                {["About", "Careers", "Affiliates"].map((ele, i) => (
                  <Link
                    key={i}
                    to={ele.toLowerCase()}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    {ele}
                  </Link>
                ))}
              </div>
              <div className="flex gap-3 text-lg">
                <FaFacebook className="cursor-pointer hover:text-richblack-50 transition-all duration-200" />
                <FaGoogle className="cursor-pointer hover:text-richblack-50 transition-all duration-200" />
                <FaTwitter className="cursor-pointer hover:text-richblack-50 transition-all duration-200" />
                <FaYoutube className="cursor-pointer hover:text-richblack-50 transition-all duration-200" />
              </div>
            </div>

            {/* Resources & Support Column */}
            <div className="w-[48%] lg:w-[30%] mt-20 lg:mt-0">
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-2">
                Resources
              </h1>
              <div className="flex flex-col gap-2 mb-6">
                {Resources.map((ele, index) => (
                  <Link
                    key={index}
                    to={ele.split(" ").join("-").toLowerCase()}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    {ele}
                  </Link>
                ))}
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-2">
                Support
              </h1>
              <Link
                to="/help-center"
                className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
              >
                Help Center
              </Link>
            </div>

            {/* Plans & Community Column */}
            <div className="w-[48%] lg:w-[30%] -mt-36 lg:mt-0">
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-2">
                Plans
              </h1>
              <div className="flex flex-col gap-2 mb-6">
                {Plans.map((ele, index) => (
                  <Link
                    key={index}
                    to={ele.split(" ").join("-").toLowerCase()}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    {ele}
                  </Link>
                ))}
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-2">
                Community
              </h1>
              <div className="flex flex-col gap-2">
                {Community.map((ele, index) => (
                  <Link
                    key={index}
                    to={ele.split(" ").join("-").toLowerCase()}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    {ele}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2 - Right Side */}
          <div className="lg:w-[50%] grid grid-cols-2 lg:grid-cols-3 gap-7 text-richblack-200 font-thin text-opacity-70 lg:pl-5 mt-7 sm:mt-0 mb-8">
            {FooterLink2.map((ele, i) => (
              <div key={i}>
                <h1 className="text-richblack-50 font-semibold text-[16px] mb-2">
                  {ele.title}
                </h1>
                <div className="flex flex-col gap-2">
                  {ele.links.map((link, index) => (
                    <Link
                      key={index}
                      to={link.link}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row text-richblack-200 font-thin text-opacity-70 items-center justify-between pt-5 mt-5 text-sm">
          <div className="flex flex-wrap justify-center gap-x-3 mb-3 lg:mb-0">
            {BottomFooter.map((ele, i) => (
              <div
                key={i}
                className={`px-3 ${
                  BottomFooter.length - 1 === i
                    ? ""
                    : "border-r border-richblack-700"
                }`}
              >
                <Link
                  to={ele.split(" ").join("-").toLowerCase()}
                  className="cursor-pointer hover:text-richblack-50 transition-all duration-200"
                >
                  {ele}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center lg:text-left">
            Made with ❤️ Rishika © 2024 Studynotion
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;