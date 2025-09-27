import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useCategoryData from "../hooks/useCategoryData";
import { useDispatch } from "react-redux";
import { setSubcategories } from "../features/category-subcategory/categorySlice";

const api = import.meta.env.VITE_API_URL;

const RemoveSubcategoryComp = () => {
  const dispatch = useDispatch();
  const {
    categories,
    subcategories,
    loading: catLoading,
    getSubcategoriesByCategoryId,
  } = useCategoryData();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedSub) return toast.error("❌ Please select a subcategory");

    const confirm = window.confirm(
      "Are you sure you want to delete this subcategory?"
    );
    if (!confirm) return;

    setLoading(true);
    try {
      const res = await axios.delete(
        `${api}/category/removeSubCategory/${selectedSub}`,
        { withCredentials: true }
      );
      toast.success("✅ " + res.data.msg);
      dispatch(setSubcategories(res.data.allSubCategory));
      setSelectedCategory("");
      setSelectedSub("");
    } catch (err) {
      const msg = err?.response?.data?.err || "❌ Failed to delete subcategory";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubcategories = selectedCategory
    ? getSubcategoriesByCategoryId(selectedCategory)
    : [];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white border border-yellow-300 shadow p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🗑️ Remove Subcategory
        </h2>

        {catLoading ? (
          <p className="text-center text-gray-600">Loading categories...</p>
        ) : (
          <div className="space-y-5">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSub("");
                }}
                className="w-full border border-gray-300 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            {selectedCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Subcategory
                </label>
                <select
                  value={selectedSub}
                  onChange={(e) => setSelectedSub(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">-- Select Subcategory --</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Delete Button */}
            {selectedCategory && (
              <button
                onClick={handleDelete}
                disabled={loading || !selectedSub}
                className={`w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Remove Subcategory"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveSubcategoryComp;
