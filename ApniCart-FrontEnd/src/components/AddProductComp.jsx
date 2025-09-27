import React, { useState } from "react";
import axios from "axios";
import useCategoryData from "../hooks/useCategoryData";
import { toast } from "react-hot-toast";

const api = import.meta.env.VITE_API_URL;

const AddProductComp = () => {
  const { categories, subcategories } = useCategoryData();

  const [formData, setFormData] = useState({
    productName: "",
    productQnt: "",
    productDescrip: "",
    productMrp: "",
    productDiscount: "",
    productCategory: "",
    productSubCategory: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) data.append("imageFile", imageFile);

    try {
      await axios.post(`${api}/product/addProduct`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage("✅ Product added successfully!");
      toast.success("Product added successfully");
      setTimeout(() => setMessage(""), 3000);

      setFormData({
        productName: "",
        productQnt: "",
        productDescrip: "",
        productMrp: "",
        productDiscount: "",
        productCategory: "",
        productSubCategory: "",
      });
      setImageFile(null);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.msg || "Unknown error"));
      toast.error("❌ Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-md max-w-xl w-full mx-auto p-5 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Add New Product
        </h2>

        {message && (
          <div className="mb-4 text-center text-orange-600 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["Product Name", "productName", "text"],
            ["Quantity", "productQnt", "number"],
            ["MRP", "productMrp", "number"],
            ["Discount", "productDiscount", "number"],
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="productDescrip"
              value={formData.productDescrip}
              onChange={handleChange}
              rows={5}
              placeholder="Write full product description here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y focus:ring-orange-400 focus:border-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="productCategory"
              value={formData.productCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              name="productSubCategory"
              value={formData.productSubCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
              required
            >
              <option value="">-- Select Subcategory --</option>
              {subcategories
                .filter((sub) => sub.parentCategory === formData.productCategory)
                .map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) {
                  setImageFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => document.getElementById("fileInput").click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed ${
                imageFile ? "border-green-500" : "border-gray-300"
              } rounded-md py-10 px-3 cursor-pointer hover:bg-gray-100 transition`}
            >
              {imageFile ? (
                <p className="text-green-600 text-sm">{imageFile.name}</p>
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  📁 Drag & drop or click to select an image
                </p>
              )}
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition shadow"
          >
            {submitting ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductComp;
