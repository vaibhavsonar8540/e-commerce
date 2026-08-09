import { login, register } from "@/service/authService";
import { loginSuccess, authRequest, authSuccess, authFailed } from "../slices/authSlice";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const loggedUser = (payload) => async (dispatch) => {
  try {
    const data = await login(payload);
    if (data?.token) {
      Cookies.set("token", data.token, { expires: 7 });
    }
    dispatch(loginSuccess(data));
    return data;
  } catch (error) {
    throw error;
  }
};

export const createUser = (payload) => async (dispatch) => {
  try {
    const data = await register(payload);
    if (data?.token) {
      Cookies.set("token", data.token, { expires: 7 });
    }
    // Automatically log in after register
    dispatch(loginSuccess(data));
    return data;
  } catch (error) {
    throw error;
  }
};

// Auto-Login verification action on page refresh
export const getLoggedInUser = () => async (dispatch) => {
  dispatch(authRequest()); 
  try {
    const { data } = await axios.get(`${baseUrl}/user/me`); 

    // Dispatches user profile payload into state
    dispatch(authSuccess(data.user)); 
  } catch (error) {
    dispatch(authFailed());
  }
};