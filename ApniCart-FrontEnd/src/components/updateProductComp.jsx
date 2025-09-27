import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useCategoryData from "../hooks/useCategoryData";
import { toast } from "react-hot-toast";
const api = import.meta.env.VITE_API_URL;
const UpdateProductComp = () => {
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
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  
  const productId = searchParams.get("id");

 

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        console.log("params:- ",productId);
        const res = await axios.get(
          `${api}/product/getProductById/${productId}`
        );
        const product = res.data.product;

        setFormData({
          productName: product.productName || "",
          productQnt: product.productQnt || "",
          productDescrip: product.productDescrip || "",
          productMrp: product.productMrp || "",
          productDiscount: product.productDiscount || "",
          productCategory: product.productCategory || "",
          productSubCategory: product.productSubCategory || "",
        });
      } catch (err) {
        console.error("Error loading product:", err);
        toast.error("❌ Failed to load product data");
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("productId", productId);
    if (imageFile) data.append("imageFile", imageFile);

    try {
      await axios.patch(`${api}/product/updateProduct`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("✅ Product updated successfully!");
      navigate("/manage-product", { state: { updated: true } });
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("❌ Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white border border-purple-200 shadow-xl rounded-3xl">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
        ✏️ Update Product Details
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="productQnt"
              value={formData.productQnt}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">
              MRP
            </label>
            <input
              type="number"
              name="productMrp"
              value={formData.productMrp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              name="productDiscount"
              value={formData.productDiscount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-1">
              Category
            </label>
            <select
              name="productCategory"
              value={formData.productCategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-1">
            Subcategory
          </label>
          <select
            name="productSubCategory"
            value={formData.productSubCategory}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <label className="block text-sm font-semibold text-purple-700 mb-1">
            Product Description
          </label>
          <textarea
            name="productDescrip"
            value={formData.productDescrip}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border rounded-xl border-purple-300 resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter full description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-700 mb-1">
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
              imageFile ? "border-green-500" : "border-purple-300"
            } rounded-xl p-6 cursor-pointer hover:bg-purple-50 transition`}
          >
            {imageFile ? (
              <p className="text-green-600 text-sm">{imageFile.name}</p>
            ) : (
              <p className="text-purple-500 text-sm">
                📂 Drag & drop image here or click to upload
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
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          {submitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProductComp;
