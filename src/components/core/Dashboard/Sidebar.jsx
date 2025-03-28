import React from 'react'
import {sidebarLinks} from "../../../data/dashboard-links"
import {logout} from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from "./SidebarLink"
import { VscSettingsGear, VscSignOut } from 'react-icons/vsc'
import { useLocation, useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../common/ConfirmationModal'
import { useState } from 'react'

const Sidebar = () => {

    const{user, loading:profileLoading} = useSelector((state) => state.profile);
    const {loading:authLoading} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const location = useLocation();

    const [confirmationModal, setConfirmationModal] = useState(null);

    const matchRoute = (route) => {
      return location.pathname === route;
  }
  

    if(profileLoading || authLoading) {
        return(
            <div className='spinner'>
            </div>
        )
    }

  return (
    <div className='text-richblack-100'>
      <div className='flex min-w-[222px] flex-col border-r-richblack-700
      h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>

      <div className='flex flex-col font-semibold'> 

      {
        sidebarLinks.map((link) =>{
            if(link.type && user?.accountType !== link.type) return null;
            return(
                <SidebarLink key = {link.id} link= {link} iconName = {link.icon}/>
            )
        })
      }

      </div>

      <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'></div>
                
                <div className='flex flex-col'>
                    <SidebarLink
                    link = {{name: "Settings", path: "/dashboard/settings"}}
                    iconName= "VscSettingsGear"
                  

         >
    
                  </SidebarLink>

                    <button onClick={() => setConfirmationModal({
                      text1: "Are you sure?",
                      text2: "You will be logged out of your account",
                      btn1Text: "Logout",
                      btn2Text: "Cancel",
                      btn1Handler: () => dispatch(logout(navigate)),
                      btn2Handler: () => setConfirmationModal(null),
                    }) }
                    className='text-sm font-medium text-richblack-300'
                    >
                        <div className='flex items-center gap-x-2 ml-8 mt-2 text-md text-richblack-100'>
                          <VscSignOut className='text-lg'/>
                          <span>Logout</span>
                        </div>

                    </button>

                    {
                      confirmationModal && <ConfirmationModal modalData = {confirmationModal}/>
                    }

                </div>

      </div>
    </div>
  )
}

export default Sidebar
