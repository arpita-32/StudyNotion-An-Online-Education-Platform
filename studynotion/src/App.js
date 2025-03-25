import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import OpenRoute from "../src/components/core/Auth/OpenRoute";
import MyProfile from "../src/components/core/Dashboard/MyProfile";
import "./App.css";
import NavBar from "./components/common/NavBar";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import AddCourse from "./components/core/Dashboard/AddCourse";
import Cart from "./components/core/Dashboard/Cart/index";
import EditCourse from "./components/core/Dashboard/EditCourse";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import MyCourses from "./components/core/Dashboard/MyCourses";
import Setting from "./components/core/Dashboard/Settings/index";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import AboutUs from "./pages/About";
import Catalog from "./pages/Catalog";
import ContactUs from "./pages/Contact";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import ViewCourse from "./pages/ViewCourse";
import { ACCOUNT_TYPE } from "./utils/constants";

function App() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <OpenRoute>
              <Home />
            </OpenRoute>
          }
        />

        <Route
          path="/catalog/:catalogName"
          element={
            <OpenRoute>
              <Catalog />
            </OpenRoute>
          }
        />

        <Route
          path="/courses/:courseId"
          element={
            <OpenRoute>
              <CourseDetails />
            </OpenRoute>
          }
        />

        <Route
          path="/about"
          element={
            <OpenRoute>
              <AboutUs />
            </OpenRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <OpenRoute>
              <ContactUs />
            </OpenRoute>
          }
        />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
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
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Setting />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="dashboard/cart" element={<Cart />} />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}

          <Route
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                  element={<VideoDetails />}
                />
              </>
            )}
          </Route>
        </Route>

        <Route element={<Error />} path="*"></Route>
      </Routes>
    </div>
  );
}

export default App;