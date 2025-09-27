// src/features/category/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  subcategories: [],
  loading: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSubcategories: (state, action) => {
      state.subcategories = action.payload;
    },
    setCategoryLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.subcategories = [];
      state.loading = false;
    },
  },
});

export const {
  setCategories,
  setSubcategories,
  setCategoryLoading,
  clearCategories,
} = categorySlice.actions;

export default categorySlice.reducer;
