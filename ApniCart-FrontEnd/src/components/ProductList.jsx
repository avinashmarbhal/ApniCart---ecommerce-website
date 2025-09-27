import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const api = import.meta.env.VITE_API_URL;
const ProductList = ({ categoryId, title = "Top Products" }) => {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${api}/category/by-category/${categoryId}?page=1&limit=4`
        );
        setProducts(res.data.products);
        setTimeout(() => setLoaded(true), 100); // fade delay
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (!products.length) return null;

  return (
    <div
      className={`bg-gray-50 p-4 rounded-xl shadow max-w-md min-h-[300px] transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-lg font-bold mb-3">{title}</h2>

      <div className="grid grid-cols-2 gap-3">
        {products[0] && (
          <Link
            to={`/viewproduct/${products[0]._id}`}
            className="flex flex-col items-center hover:shadow-md p-2 rounded transition"
          >
            <img
              src={products[0].productImage?.url || "/placeholder.png"}
              alt={products[0].productName}
              className="w-24 h-24 object-contain"
            />
            <p className="text-sm text-center mt-1 truncate w-full">
              {products[0].productName}
            </p>
          </Link>
        )}
        {products[1] && (
          <Link
            to={`/viewproduct/${products[1]._id}`}
            className="flex flex-col items-center hover:shadow-md p-2 rounded transition"
          >
            <img
              src={products[1].productImage?.url || "/placeholder.png"}
              alt={products[1].productName}
              className="w-24 h-24 object-contain"
            />
            <p className="text-sm text-center mt-1 truncate w-full">
              {products[1].productName}
            </p>
          </Link>
        )}
        {products[2] && (
          <Link
            to={`/viewproduct/${products[2]._id}`}
            className="flex flex-col items-center hover:shadow-md p-2 rounded transition"
          >
            <img
              src={products[2].productImage?.url || "/placeholder.png"}
              alt={products[2].productName}
              className="w-24 h-24 object-contain"
            />
            <p className="text-sm text-center mt-1 truncate w-full">
              {products[2].productName}
            </p>
          </Link>
        )}
        {products[3] && (
          <Link
            to={`/viewproduct/${products[3]._id}`}
            className="flex flex-col items-center hover:shadow-md p-2 rounded transition"
          >
            <img
              src={products[3].productImage?.url || "/placeholder.png"}
              alt={products[3].productName}
              className="w-24 h-24 object-contain"
            />
            <p className="text-sm text-center mt-1 truncate w-full">
              {products[3].productName}
            </p>
          </Link>
        )}
      </div>

      <div className="mt-4 text-sm">
        <Link
          to={`/searchCategory/${categoryId}`}
          className="text-blue-600 hover:underline"
        >
          See more
        </Link>
      </div>
    </div>
  );
};

export default ProductList;
