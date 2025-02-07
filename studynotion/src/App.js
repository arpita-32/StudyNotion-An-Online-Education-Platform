import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Navbar from './components/common/Navbar';
import OpenRoute from "./components/core/Auth/OpenRoute";
import About from "./pages/About";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Settings from "./components/core/Dashboard/Settings";
import MyProfile from "./components/core/Dashboard/MyProfile";

function App() {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar/>
    <Routes>
      <Route path ="/" element={<Home/>}></Route>
      <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

    <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />  
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />  

    <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />  
         <Route
          path="/about"
          element={
            
              <About />
            
          }
        />
            <Route path="/contact" element={<Contact />} />
            <Route 
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />
     <Route path="dashboard/my-profile" element={<MyProfile />} />
      
      <Route path="dashboard/Settings" element={<Settings />} />


    </Routes>
    </div>
  );
}

export default App;
