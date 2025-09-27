import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useCategoryData from "../hooks/useCategoryData";
import RelatedProductCard from "./RelatedProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const api = import.meta.env.VITE_API_URL;

const RelatedProductRows = ({ currentProductId, currentCategoryId }) => {
  const { subcategories } = useCategoryData();
  const [rowsData, setRowsData] = useState({});
  const rowRefs = useRef({});

  useEffect(() => {
    if (!subcategories || subcategories.length === 0) return;

    const fetchProducts = async () => {
      const filteredSubcats = subcategories.filter(
        (sub) => sub.parentCategory === currentCategoryId
      );

      const tempData = {};

      await Promise.all(
        filteredSubcats.map(async (sub) => {
          try {
            const res = await axios.get(
              `${api}/category/by-subCategory/${sub._id}?page=1&limit=10`
            );
            const products = res.data.products?.filter(
              (p) => p._id !== currentProductId
            );

            if (products && products.length > 0) {
              tempData[sub.name] = products;
            }
          } catch (err) {
            console.error(`❌ Error loading ${sub.name}:`, err);
          }
        })
      );

      setRowsData(tempData);
    };

    fetchProducts();
  }, [subcategories, currentCategoryId, currentProductId]);

  const scroll = (rowKey, direction) => {
    const container = rowRefs.current[rowKey];
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-10">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Related Products</h1>

      {Object.keys(rowsData).map((rowKey) => (
        <div key={rowKey}>
          <h2 className="text-lg md:text-xl font-semibold mb-3">{rowKey}</h2>
          <div className="relative">
            {/* Left Scroll */}
            <button
              onClick={() => scroll(rowKey, "left")}
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
            >
              <FaChevronLeft />
            </button>

            {/* Product List */}
            <div
              ref={(el) => (rowRefs.current[rowKey] = el)}
              className="flex gap-4 overflow-x-auto px-1 md:px-8 scrollbar-hide scroll-smooth snap-x snap-mandatory"
            >
              {rowsData[rowKey].map((product) => (
                <Link
                  key={product._id}
                  to={`/viewproduct/${product._id}`}
                  className="snap-start w-full sm:w-[45%] md:w-[220px] xl:w-[250px] flex-shrink-0"
                >
                  <RelatedProductCard
                    _id={product._id}
                    productName={product.productName}
                    rating={4.1}
                    productMrp={product.productMrp}
                    productDiscount={product.productDiscount}
                    discountedPrice={product.discountedPrice}
                    productQnt={product.productQnt}
                    productImage={product.productImage?.url}
                  />
                </Link>
              ))}
            </div>

            {/* Right Scroll */}
            <button
              onClick={() => scroll(rowKey, "right")}
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedProductRows;
