import React, { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const api = import.meta.env.VITE_API_URL;

export default function SearchCategoryComp({ id }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = parseInt(searchParams.get("page")) || 1;
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${api}/category/by-category/${id}?page=${page}&limit=9`
        );
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, page, location.search]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    navigate(`/searchCategory/${id}?page=${newPage}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 4) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
        Products
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              productName={product.productName}
              rating={4.1}
              productMrp={product.productMrp}
              productDiscount={product.productDiscount}
              discountedPrice={product.discountedPrice}
              productQnt={product.productQnt}
              productImage={product.productImage?.url}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap justify-center mt-8 gap-2">
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-1 rounded border text-sm font-medium bg-white text-gray-800 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          &lt; Previous
        </button>

        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-3 py-1 text-sm text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1 border text-sm font-medium ${
                p === page
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-1 rounded border text-sm font-medium bg-white text-gray-800 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
