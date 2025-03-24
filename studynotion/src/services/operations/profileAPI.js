import { toast } from "react-hot-toast"
import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { profileEndpoints } from "../api"
import { logout } from "./authAPI"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } = profileEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading user details...");
    dispatch(setLoading(true));
    
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response?.data?.success) {
        throw new Error(response.data.message || "Failed to fetch user details");
      }

      const userData = response.data.data;
      const userImage = userData?.image 
        ? userData.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName || ''} ${userData.lastName || ''}`;

      dispatch(setUser({ ...userData, image: userImage }));
    } catch (error) {
      console.error("GET_USER_DETAILS ERROR:", error);
      
      // Only logout if it's an authentication error
      if ([401, 403].includes(error.response?.status)) {
        dispatch(logout(navigate));
      }
      
      toast.error(error.message || "Could not get user details");
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Fetching enrolled courses...");
  try {
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response.data.message || "Failed to fetch enrolled courses");
    }

    return response.data.data || [];
  } catch (error) {
    console.error("GET_USER_ENROLLED_COURSES_API ERROR:", error);
    
    // Only show toast if it's not a 401/403 (unauthorized) error
    if (![401, 403].includes(error.response?.status)) {
      toast.error(error.message || "Could not get enrolled courses");
    }
    
    return [];
  } finally {
    toast.dismiss(toastId);
  }
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, 
    {
      Authorization: `Bearer ${token}`,
    })

    console.log("GET_INSTRUCTOR_API_RESPONSE", response);
    result = response?.data?.courses

  }
  catch(error) {
    console.log("GET_INSTRUCTOR_API ERROR", error);
    toast.error("Could not Get Instructor Data")
  }
  toast.dismiss(toastId);
  return result;
}