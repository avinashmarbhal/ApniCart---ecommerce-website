import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setSubcategories } from "../features/category-subcategory/categorySlice";

const api = import.meta.env.VITE_API_URL;

const AddSubcategoryComp = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!name.trim() || !parentCategory) {
      toast.error("❌ Please provide both name and category");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${api}/category/addSubCategory`,
        { name, parentCategory },
        { withCredentials: true }
      );
      toast.success("✅ " + res.data.message);
      dispatch(setSubcategories(res.data.allSubCategory));
      setName("");
      setParentCategory("");
    } catch (err) {
      const msg =
        err?.response?.data?.error || "❌ Failed to create subcategory";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white border border-yellow-300 shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🗂️ Add Subcategory
        </h2>

        <form onSubmit={handleAddSubcategory} className="space-y-5">
          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Parent Category
            </label>
            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Subcategory Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subcategory name"
              className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded shadow transition duration-200 ${
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
                Creating...
              </span>
            ) : (
              "Add Subcategory"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubcategoryComp;
