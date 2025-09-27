import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import emptyCart from "../assets/empty-cart.json";
import CartCard from "../components/CartCard";

const CartComp = () => {
  const navigate = useNavigate();
  const { cartItems, totalMrpPrice, totalDiscountedPrice } = useSelector(
    (state) => state.cart
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center md:text-left">
        Shopping Cart
      </h1>

      {!cartItems || cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Lottie
            animationData={emptyCart}
            loop
            style={{ height: 250, width: 250 }}
          />
          <p className="text-xl sm:text-2xl text-gray-600 mt-4 text-center">
            Your cart is empty
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <CartCard key={item._id} item={item} />
            ))}
          </div>

          {/* Summary Section */}
          <div className="w-full lg:w-[320px] bg-white p-4 sm:p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Price Details</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between text-gray-800">
                <span>Total MRP</span>
                <span>₹{totalMrpPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>
                  − ₹{(totalMrpPrice - totalDiscountedPrice).toLocaleString()}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Total Amount</span>
                <span>₹{totalDiscountedPrice.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 w-full py-2 rounded font-semibold text-black"
            >
              Proceed to Buy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartComp;
