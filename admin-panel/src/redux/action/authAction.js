import api from "@/utils/axiosInstant";
import { authRequest, authSuccess, authFailed } from "../slices/authSlice";

// Auto-Login verification action on page refresh
export const getLoggedInUser = () => async (dispatch) => {
  dispatch(authRequest()); 
  try {
    const { data } = await api.get("/user/me"); 
    
    if (data && data.success && data.user) {
      if (data.user.role === "admin") {
        dispatch(authSuccess(data.user)); 
      } else {
        // Non-admin roles should not be in the admin portal
        dispatch(authFailed());
      }
    } else {
      dispatch(authFailed());
    }
  } catch (error) {
    console.error("Auth persistence check failed:", error);
    dispatch(authFailed());
  }
};
