import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collection: [],
  categories: [],
  subCategories: [],
  isMobileMenuOpen: false,
  loading: false,
  isModelOpen : false,
  isEdit : false
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    // Collections
    setCollection: (state, action) => {
      state.collection = action.payload;
    },

    // Categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    // Sub Categories
    setSubCategories: (state, action) => {
      state.subCategories = action.payload;
    },

    // Mobile Menu
    setIsMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },

    // Loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setIsModelOpen : (state , action) => {
      state.isModelOpen = action.payload
    },

    setIsEdit : (state ,action) => {
      state.isEdit = action.payload
    },

    // Optional: Reset Common State
    resetCommonState: () => initialState,
  },
});

export const {
  setCollection,
  setCategories,
  setSubCategories,
  setIsMobileMenuOpen,
  setLoading,
  setIsModelOpen,
  setIsEdit,
  resetCommonState,
} = commonSlice.actions;

export default commonSlice.reducer;