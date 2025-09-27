// src/hooks/useCategoryData.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategories,
  setSubcategories,
  setCategoryLoading,
} from "../features/category-subcategory/categorySlice";
import axios from "axios";
const api = import.meta.env.VITE_API_URL;
const CATEGORY_URL = `${api}/category/allCategory`;
const SUBCATEGORY_URL = `${api}/category/allSubCategory`;

function useCategoryData() {
  const dispatch = useDispatch();

  const { categories, subcategories, loading } = useSelector(
    (state) => state.category
  );

  // Helper to get subcategories for a given category ID
  const getSubcategoriesByCategoryId = (categoryId) => {
    return subcategories.filter((sub) => sub.parentCategory === categoryId);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(setCategoryLoading(true));
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get(CATEGORY_URL),
          axios.get(SUBCATEGORY_URL),
        ]);
        dispatch(setCategories(catRes.data.allCategory));
        dispatch(setSubcategories(subRes.data.allSubCategory));
      } catch (err) {
        console.error("❌ Error fetching category data:", err);
      } finally {
        dispatch(setCategoryLoading(false));
      }
    };

    if (categories.length === 0 || subcategories.length === 0) {
      fetchCategories();
    }
  }, [dispatch]);

  return {
    categories,
    subcategories,
    loading,
    getSubcategoriesByCategoryId,
  };
}

export default useCategoryData;
