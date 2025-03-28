import React from 'react'
import * as Icons from "react-icons/vsc"
import { NavLink, matchPath, useLocation } from "react-router-dom"

const SidebarLink = ({link, iconName}) => {

    const Icon = Icons[iconName];
    const location = useLocation();


    const matchRoute = (route) => {
      return location.pathname === route;
  }
  

  return (
    <NavLink
    to= {link.path}
   // onClick = {onClickHandler}
    className = {`relative px-8 py-2 text-sm font-medium ${matchRoute(link.path) ? "bg-yellow-700" : "bg-opacity-0"}`}
    >
      <span className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50
      matchRoute ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}></span>

      

      <div className='flex item-center gap-x-2'>

        <Icon className= {`${matchRoute(link.path)? "text-yellow-50" :"text-richblack-100"} text-lg`}/>
         <span className= {`${matchRoute(link.path)? "text-yellow-50" :"text-richblack-100"}`}>{link.name}</span>
      </div>
    </NavLink>
  )
}

export default SidebarLink
