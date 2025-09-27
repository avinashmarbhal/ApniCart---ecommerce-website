import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCartData } from "../features/cart/cartSlice";

const api = import.meta.env.VITE_API_URL;

const ProductCard = ({
  _id,
  productName,
  rating,
  productMrp,
  productDiscount,
  discountedPrice,
  productQnt,
  productImage,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const updateReduxCart = (cart) => {
    dispatch(
      setCartData({
        cartItems: cart.item,
        totalItems: cart.totalItems,
        totalMrpPrice: cart.totalMrpPrice,
        totalDiscountedPrice: cart.totalDiscountedPrice,
      })
    );
  };

  const boughtCount = productQnt * 5;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
    } else {
      try {
        const res = await axios.post(
          `${api}/cart/addItem`,
          {
            productId: _id,
            quantity: 1,
          },
          { withCredentials: true }
        );
        updateReduxCart(res.data.cart);
        toast.success("🛒 Product added to cart successfully");
      } catch {
        toast.error("❌ Failed to add product to cart");
      }
    }
  };

  return (
    <div className="bg-white shadow rounded w-full hover:shadow-lg transition overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <Link
          to={`/viewproduct/${_id}`}
          className="md:w-1/4 p-4 flex items-center justify-center"
        >
          <img
            src={productImage}
            alt={productName}
            className="h-40 object-contain"
          />
        </Link>

        {/* Details */}
        <div className="flex flex-col justify-between p-4 md:w-3/4">
          <div>
            <Link to={`/viewproduct/${_id}`}>
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {productName}
              </h2>

              <div className="flex items-center mt-1 text-sm">
                <span className="text-yellow-500 flex items-center">
                  {rating.toFixed(1)} <FaStar className="ml-1" />
                </span>
                <span className="ml-2 text-gray-500">
                  ({Math.floor(rating * 10)})
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {boughtCount}+ bought in past month
              </p>

              <div className="inline-block mt-2 text-sm bg-red-600 text-white px-2 py-1 rounded-sm font-medium">
                Limited time deal
              </div>

              <div className="mt-2 text-xl font-bold text-gray-900">
                ₹{discountedPrice}
              </div>
              <div className="text-sm text-gray-500 line-through">
                M.R.P: ₹{productMrp}
              </div>
              <div className="text-sm text-green-600 font-semibold">
                ({productDiscount}% off)
              </div>

              <div className="text-sm mt-1">FREE delivery within 2-3 days</div>
            </Link>
          </div>

          {/* Button aligned bottom right on desktop, full width on mobile */}
          <div className="mt-4 md:mt-2 md:flex md:justify-end">
            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 text-sm font-medium w-full md:w-auto"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
