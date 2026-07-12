import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./slices/commonSlice";
import authReducer from "./slices/authSlice"

export const store = configureStore({
  reducer: {
    common: commonReducer,
    auth : authReducer
  },
});