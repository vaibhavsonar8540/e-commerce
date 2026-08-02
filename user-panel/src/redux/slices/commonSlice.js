import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collection: [],
  categories: [],
  subCategories: [],
  isHover: false,
  headerHeight : null ,
  isHeaderTransparent: false,
  isMobileMenuOpen: false,
  loading: false,
  isModelOpen : false,
  isCartOpen : false,
  cart: { items: [], subTotal: 0, discountApplied: 0, grandTotal: 0 },
  wishlist: [],
  flashMessage: null
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

    // Header Hover
    setIsHover: (state, action) => {
      state.isHover = action.payload;
    },

    setHeaderHeight : (state , action) => {
      state.headerHeight = action.payload
    },

    // Header Transparency
    setIsHeaderTransparent: (state, action) => {
      state.isHeaderTransparent = action.payload;
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

    setIsCartOpen : (state , action) => {
      state.isCartOpen = action.payload
    },

    setCart : (state , action) => {
      state.cart = action.payload
    },

    setWishlist : (state , action) => {
      state.wishlist = action.payload
    },

    setFlashMessage : (state, action) => {
      state.flashMessage = action.payload;
    },

    // Optional: Reset Common State
    resetCommonState: () => initialState,
  },
});

export const {
  setCollection,
  setCategories,
  setSubCategories,
  setIsHover,
  setIsHeaderTransparent,
  setIsMobileMenuOpen,
  setLoading,
  setHeaderHeight,
  setIsModelOpen,
  setIsCartOpen,
  setCart,
  setWishlist,
  setFlashMessage,
  resetCommonState,
} = commonSlice.actions;

export default commonSlice.reducer;