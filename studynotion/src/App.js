import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Home from './pages/Home'
import PageNotFound from './components/core/HomePage/PageNotFound'
import NavBar from "./components/common/Navbar";
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OpenRoute from './components/core/Auth/OpenRoute'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import ContactUs from './pages/Contact'
import AboutUs from './pages/About'
import Dashboard from './pages/Dashboard'
import Profile from './components/core/Dashboard/Profile';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import Setting from './components/core/Dashboard/Setting';
import Cart from './components/core/Dashboard/Cart/index';
import StudentOnlyRoute from './components/core/Auth/StudentOnlyRoute'
import InstructorOnlyRoute from './components/core/Auth/InstructorOnlyRoute'
import InstructorCourses from './components/core/Dashboard/Instructor/InstructorCourses'
import AddCourse from './components/core/Dashboard/AddCourse'
import EditCourse from './components/core/Dashboard/EditCourse/index'
import Catalog from './pages/Catalog'
import CoursePage from './pages/CoursePage'
import ViewCourse from './pages/ViewCourse'
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor'

const App = () => {



  return (
    <div className="container width-screen min-h-screen bg-richblack-900 flex flex-col font-inter">

  {/* navbar is a common componenet that is why we will place this here and that will dont have any route */}
  {/* as nav bar is common so we will make its component in common folder of core of component */}
      <NavBar/>

      <Routes>

        <Route path='/' element= {<Home/>} />
        <Route path='*' element={<PageNotFound/>}/>
        <Route path='login' element={<OpenRoute> <Login/> </OpenRoute> } />
        <Route path='signup' element={<OpenRoute> <Signup/> </OpenRoute>}/>
        <Route path='forgot-password' element={<OpenRoute> <ForgotPassword/> </OpenRoute>}/>
        <Route path='reset-password/:token' element={<UpdatePassword/>}/>
        <Route path='verify-email' element={<VerifyEmail/>}/>
        <Route path='contact' element={<ContactUs/>}/>
        <Route path='about' element={<AboutUs/>}/>

        {/* nested route */}
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}>
            <Route path='/dashboard/my-profile' element={<Profile/>}/>
            <Route path='/dashboard/settings' element={<Setting/>}/>
            <Route path='/dashboard/enrolled-courses' element={<StudentOnlyRoute><EnrolledCourses/></StudentOnlyRoute>}/>
            <Route path='/dashboard/cart' element={<StudentOnlyRoute><Cart/></StudentOnlyRoute>}/>
            <Route path='/dashboard/my-courses' element={<InstructorOnlyRoute><InstructorCourses/></InstructorOnlyRoute>}/>
            <Route path='/dashboard/add-course' element={<InstructorOnlyRoute><AddCourse/></InstructorOnlyRoute>}/>
            <Route path='/dashboard/edit-course/:courseId' element={<InstructorOnlyRoute><EditCourse/></InstructorOnlyRoute>}/>
            <Route path='/dashboard/instructor' element={<InstructorOnlyRoute><Instructor/></InstructorOnlyRoute>} />
            
        </Route>

        <Route path='/catalog/:catalogName' element={<Catalog/>}/>
        <Route path='/courses/:courseId' element={<CoursePage/>}/>
        <Route path='/view-course/:courseId/section/:sectionId/sub-section/:subsectionId' element={<StudentOnlyRoute><ViewCourse/></StudentOnlyRoute>} />
        

     </Routes>

    </div>
  )
}

export default App;