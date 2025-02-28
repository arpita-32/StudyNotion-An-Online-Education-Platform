import React from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import * as Icons from 'react-icons/vsc';
import { IoSettingsOutline } from "react-icons/io5";
import { PiSignOut } from "react-icons/pi";

const Sidebar = ({ setshowModal }) => {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen bg-richblack-800 shadow-lg">
      <div className="flex flex-col gap-5 h-full w-64 pt-6 px-4">
        <div className="flex flex-col gap-3">
          {sidebarLinks.map((link, index) => {
            const Icon = Icons[link.icon];
            if (!link.type) {
              return (
                <NavLink key={index} to={link.path} className="hover:no-underline">
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === link.path ? 'bg-richblack-900 text-yellow-200' : 'text-richblack-100 hover:bg-richblack-700'}`}>
                    <Icon className="text-xl" />
                    <p className="text-sm font-medium">{link.name}</p>
                  </div>
                </NavLink>
              );
            }

            if (user && link.type === user?.accountType) {
              return (
                <NavLink key={index} to={link.path} className="hover:no-underline">
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === link.path ? 'bg-richblack-900 text-yellow-200' : 'text-richblack-100 hover:bg-richblack-700'}`}>
                    <Icon className="text-xl" />
                    <p className="text-sm font-medium">{link.name}</p>
                  </div>
                </NavLink>
              );
            }

            return null;
          })}
        </div>

        <div className="h-[1px] bg-richblack-600 my-4"></div>

        <div className="flex flex-col gap-3">
          <NavLink to={'/dashboard/settings'} className="hover:no-underline">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/dashboard/settings' ? 'bg-richblack-900 text-yellow-200' : 'text-richblack-100 hover:bg-richblack-700'}`}>
              <IoSettingsOutline className="text-xl" />
              <p className="text-sm font-medium">Settings</p>
            </div>
          </NavLink>

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-richblack-100 hover:bg-richblack-700 transition-all duration-200"
            onClick={() => setshowModal(true)}
          >
            <PiSignOut className="text-xl" />
            <p className="text-sm font-medium">LogOut</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;