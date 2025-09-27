import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
const api = import.meta.env.VITE_API_URL;
const limit = 8;

const SProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const fetchProducts = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${api}/product/productSearch?q=${encodeURIComponent(
          searchTerm
        )}&page=${page}&limit=${limit}`
      );

      const data = response.data;
      setProducts(data.products || []);
      const totalCount = data.total || data.products.length;
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error("Error fetching searched products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, page]);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ search: searchTerm, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" }); // 🔥 scroll to top on page change
  };

  const renderPageNumbers = () => {
    const pages = [];
    const visibleRange = 2;

    if (page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => goToPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          &laquo;
        </button>
      );
    }

    if (page > visibleRange + 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          1
        </button>,
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    for (
      let i = Math.max(1, page - visibleRange);
      i <= Math.min(totalPages, page + visibleRange);
      i++
    ) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded ${
            i === page
              ? "bg-purple-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (page < totalPages - visibleRange) {
      pages.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>,
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          {totalPages}
        </button>
      );
    }

    if (page < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => goToPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          &raquo;
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
        Search Results for "{searchTerm}"
      </h1>

      {loading ? (
        <div className="text-center text-purple-600">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                _id={product._id}
                productName={product.productName}
                rating={product.rating || 4.3}
                productMrp={product.productMrp}
                productDiscount={product.productDiscount}
                discountedPrice={product.discountedPrice}
                productQnt={product.productQnt}
                productImage={product.productImage?.url || "/altImg.png"}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
            {renderPageNumbers()}
          </div>
        </>
      )}
    </div>
  );
};

export default SProducts;
