import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true, // Start as true so the page doesn't flicker unauthenticated states on refresh
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    authRequest: (state) => {
      state.loading = true;
    },

    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },

    authSuccess: (state, action) => {
      state.user = action.payload; // For hydrating user info from /me endpoint
      state.isAuthenticated = true;
      state.loading = false;
    },

    authFailed: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    updateUser: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const {
  authRequest,
  loginSuccess,
  authSuccess,
  authFailed,
  updateUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;