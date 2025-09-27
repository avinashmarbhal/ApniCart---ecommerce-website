import React, { useState } from "react";
import { FaTrashAlt, FaShareAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setCartData } from "../features/cart/cartSlice";
import ShareProductOverlay from "./ShareProductOverlay";
const api = import.meta.env.VITE_API_URL;

const CartCard = ({ item }) => {
  const dispatch = useDispatch();
  const { _id, isSelected, quantity, product } = item;
  const showMrp = product.productMrp !== product.discountedPrice;
  const [showShare, setShowShare] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const shareUrl = `${window.location.origin}/viewproduct/${product._id}`;

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

  const handleDelete = async () => {
    try {
      setLoadingAction("delete");
      const res = await axios.delete(`${api}/cart/removeItem/${product._id}`, {
        withCredentials: true,
      });
      updateReduxCart(res.data.cart);
      toast.success("🗑️ Product removed from cart");
    } catch (err) {
      toast.error("❌ Failed to remove item");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleIncrease = async () => {
    try {
      setLoadingAction("increase");
      const res = await axios.patch(
        `${api}/cart/increaseQuantity/${product._id}`,
        {},
        { withCredentials: true }
      );
      updateReduxCart(res.data.cart);
    } catch (err) {
      toast.error("❌ Failed to increase quantity");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDecrease = async () => {
    try {
      setLoadingAction("decrease");
      const res = await axios.patch(
        `${api}/cart/decreaseQuantity/${product._id}`,
        {},
        { withCredentials: true }
      );
      updateReduxCart(res.data.cart);
    } catch (err) {
      toast.error("❌ Failed to decrease quantity");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleSelect = async () => {
    try {
      setLoadingAction("toggle");
      const res = await axios.patch(
        `${api}/cart/selectToggle/${product._id}`,
        {},
        { withCredentials: true }
      );
      updateReduxCart(res.data.cart);
    } catch (err) {
      toast.error("❌ Failed to toggle selection");
    } finally {
      setLoadingAction(null);
    }
  };

  const Spinner = (
    <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
  );

  const isBusy = ["increase", "decrease", "delete", "toggle"].includes(
    loadingAction
  );
  const outOfStock = product.productQnt === 0;
  const noMoreStock = quantity >= Math.min(5, product.productQnt);

  return (
    <>
      <div className="flex items-start gap-4 border rounded p-4 bg-white shadow-sm">
        <input
          type="checkbox"
          className="mt-2 scale-125 accent-yellow-500"
          checked={isSelected}
          onChange={handleToggleSelect}
          disabled={loadingAction === "toggle"}
        />

        <Link to={`/viewproduct/${product._id}`} className="shrink-0">
          <img
            src={product.productImage?.url || "/placeholder.png"}
            alt={product.productName}
            className="w-24 h-24 object-contain"
          />
        </Link>

        <div className="flex flex-col gap-1 flex-grow text-sm">
          <Link
            to={`/viewproduct/${product._id}`}
            className="font-medium text-gray-800 hover:text-blue-600"
          >
            {product.productName}
          </Link>

          <span className="text-red-600 font-semibold">Limited time deal</span>
          {showMrp && (
            <span className="inline-block bg-red-100 text-red-600 text-xs px-1 rounded w-10">
              -{Math.round(
                ((product.productMrp - product.discountedPrice) * 100) /
                  product.productMrp
              )}%
            </span>
          )}

          <div className="flex items-center gap-2 text-lg font-semibold">
            ₹{product.discountedPrice?.toLocaleString()}
            {showMrp && (
              <span className="line-through text-sm text-gray-500">
                ₹{product.productMrp?.toLocaleString()}
              </span>
            )}
          </div>

          <span className="text-green-600">Eligible for FREE Shipping</span>
          <span className="text-green-600">{outOfStock ? "Out of stock" : "In stock"}</span>

          <div className="flex flex-wrap gap-2 items-center mt-2">
            <div className="flex items-center border border-yellow-400 rounded-full px-2 py-1 text-sm h-8">
              {loadingAction === "increase" || loadingAction === "decrease" ? (
                Spinner
              ) : (
                <>
                  {quantity === 1 ? (
                    <button
                      onClick={handleDelete}
                      className="text-red-500 px-2"
                      disabled={isBusy}
                    >
                      <FaTrashAlt />
                    </button>
                  ) : (
                    <button
                      onClick={handleDecrease}
                      className="px-2 hover:text-yellow-600"
                      disabled={isBusy}
                    >
                      -
                    </button>
                  )}
                  <span className="px-2">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="px-2 hover:text-yellow-600"
                    disabled={isBusy || noMoreStock}
                    title={noMoreStock ? "Max 5 items allowed" : ""}
                  >
                    +
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleDelete}
              className="text-sm text-blue-600"
              disabled={isBusy}
            >
              Delete
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="text-sm text-blue-600 flex items-center gap-1"
            >
              <FaShareAlt /> Share
            </button>
            <Link
              to={`/searchCategory/${product.productCategory}`}
              className="text-sm text-blue-600 hover:underline"
            >
              See more like this
            </Link>
          </div>
        </div>
      </div>

      {showShare && (
        <ShareProductOverlay
          url={shareUrl}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
};

export default CartCard;