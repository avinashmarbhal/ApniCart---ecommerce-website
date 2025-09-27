import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ManageProductCard from "./ManageProductCard";
const api = import.meta.env.VITE_API_URL;
const PRODUCTS_PER_PAGE = 12;

const ManageProductComp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${api}/product/getAllProductByUserId?page=${page}&limit=${PRODUCTS_PER_PAGE}&search=${encodeURIComponent(
            search
          )}`,
          { withCredentials: true }
        );
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching user products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, search]);

  const deleteProduct = async (productId) => {
    setDeletingId(productId);
    try {
      await axios.delete(`${api}/product/removeProduct`, {
        data: { productId },
        withCredentials: true,
      });
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ page: newPage, search });
  };

  const handleUpdate = (productId) => {
    navigate(`/update-product?id=${productId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Manage Your Products
      </h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ManageProductCard
              key={product._id}
              image={product.productImage?.url}
              name={product.productName}
              quantity={product.productQnt}
              onEdit={() => handleUpdate(product._id)}
              onDelete={() => deleteProduct(product._id)}
              isDeleting={deletingId === product._id}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          {/* Previous */}
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 text-sm bg-[#FF9900] hover:bg-[#e48b00] text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            &lt; Previous
          </button>

          {/* Page Numbers */}
          {(() => {
            const pages = [];
            const pageRange = 2;

            if (page > 2) {
              pages.push(
                <button
                  key={1}
                  onClick={() => goToPage(1)}
                  className={`px-3 py-1 text-sm rounded ${
                    page === 1
                      ? "bg-[#FF9900] text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  1
                </button>
              );
            }

            if (page > 3) pages.push(<span key="start-ellipsis">...</span>);

            for (
              let p = Math.max(2, page - pageRange);
              p <= Math.min(totalPages - 1, page + pageRange);
              p++
            ) {
              pages.push(
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1 text-sm rounded ${
                    page === p
                      ? "bg-[#FF9900] text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  {p}
                </button>
              );
            }

            if (page < totalPages - 2)
              pages.push(<span key="end-ellipsis">...</span>);

            if (page < totalPages - 1) {
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => goToPage(totalPages)}
                  className={`px-3 py-1 text-sm rounded ${
                    page === totalPages
                      ? "bg-[#FF9900] text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          {/* Next */}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 text-sm bg-[#FF9900] hover:bg-[#e48b00] text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageProductComp;
