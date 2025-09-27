import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useCategoryData from "../hooks/useCategoryData";
import { setCategories } from "../features/category-subcategory/categorySlice";
import { useDispatch } from "react-redux";

const api = import.meta.env.VITE_API_URL;

const RemoveCategoryComp = () => {
  const dispatch = useDispatch();
  const { categories, loading: catLoading } = useCategoryData();
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedId) return toast.error("❌ Please select a category");

    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await axios.delete(
        `${api}/category/removeCategory/${selectedId}`,
        { withCredentials: true }
      );
      toast.success("✅ " + res.data.msg);
      dispatch(setCategories(res.data.allCategory));
      setSelectedId("");
    } catch (err) {
      const msg = err?.response?.data?.err || "❌ Failed to delete category";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white border border-yellow-300 shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🗑️ Remove Category
        </h2>

        {catLoading ? (
          <p className="text-center text-gray-600">Loading categories...</p>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Select Category
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">-- Select --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDelete}
              disabled={loading || !selectedId}
              className={`w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-200 ${
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
                "Remove Category"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveCategoryComp;
