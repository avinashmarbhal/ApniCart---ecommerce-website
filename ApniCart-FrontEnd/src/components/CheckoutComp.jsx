import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Overlay from "../components/Overlay";
import { setCartData } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
const api = import.meta.env.VITE_API_URL;
const CheckoutComp = () => {
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [cart, setCart] = useState({
    selectedItems: [],
    totalMrpPrice: 0,
    totalDiscountedPrice: 0,
  });
  const dispatch = useDispatch();
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

  const options = [
    {
      value: "COD",
      label: "Cash on Delivery / Pay on Delivery",
      description: "Cash, UPI and Cards accepted. Know more",
      note: "A convenience fee of ₹10 will apply.",
    },
    {
      value: "CARD",
      label: "Credit or Debit Card",
    },
    {
      value: "NETBANKING",
      label: "Net Banking",
    },
    {
      value: "UPI",
      label: "Other UPI Apps",
    },
  ];

  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const defaultAddress = useSelector(
    (state) => state.address.address || "No address found"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSelectedCart = async () => {
      try {
        const res = await axios.get(`${api}/cart/selected`, {
          withCredentials: true,
        });
        setCart(res.data);
      } catch (err) {
        toast.error("Failed to load cart data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectedCart();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      setGlobalLoading(true);
      const orderPayload = {
        items: cart.selectedItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: defaultAddress.fullName,
          mobileNumber: defaultAddress.mobileNumber,
          pinCode: defaultAddress.pinCode,
          houseNumber: defaultAddress.houseNumber,
          street: defaultAddress.street,
          landmark: defaultAddress.landmark,
          city: defaultAddress.city,
          state: defaultAddress.state,
          country: defaultAddress.country,
          addressType: defaultAddress.addressType,
        },
        paymentMethod: selectedPayment,
        paymentStatus: "paid",
        totalMrp: cart.totalMrpPrice,
        totalDiscounted: cart.totalMrpPrice - cart.totalDiscountedPrice,
        finalAmount: cart.totalDiscountedPrice + 80 - 50.01,
      };

      const res = await axios.post(`${api}/order/placeOrder`, orderPayload, {
        withCredentials: true,
      });

      if (res.data?.order) {
        toast.success("🎉 Order placed successfully!");
        const res = await axios.delete(`${api}/cart/removeSelectedItems`, {
          withCredentials: true,
        });
        updateReduxCart(res.data.cart);
        navigate("/");
      } else {
        toast.error("❌ Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while placing the order.");
    } finally {
      setGlobalLoading(false);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading checkout details...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div className="border p-4 rounded mb-4 bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">
            Delivering to {`${defaultAddress.fullName}`}
          </h2>
          <p>{`${defaultAddress.street},${defaultAddress.landmark},${defaultAddress.city},${defaultAddress.state},${defaultAddress.pinCode},${defaultAddress.country}`}</p>
          <p>{`${defaultAddress.mobileNumber}`}</p>
          <button
            onClick={() => setShowOverlay(true)}
            className="text-blue-600 mt-1 hover:underline"
          >
            {defaultAddress.city ? "Change" : "AddAddress"}
          </button>
        </div>

        <div className="border p-4 rounded bg-white shadow space-y-4">
          <h2 className="text-lg font-semibold">Payment method</h2>
          <p className="text-sm text-blue-600">
            The bank offer depends on the payment method you choose. The final
            payment amount will be shown on next page.
          </p>

          {options.map((option) => {
            const isSelected = selectedPayment === option.value;
            return (
              <label
                key={option.value}
                className={`block rounded p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border border-yellow-500 bg-yellow-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setSelectedPayment(option.value)}
                    className="mt-1 accent-yellow-500"
                  />
                  <div>
                    <p className="font-medium">{option.label}</p>
                    {option.description && (
                      <p className="text-sm text-gray-700">
                        {option.description.includes("Know more") ? (
                          <>
                            Cash, UPI and Cards accepted.{" "}
                            <span className="text-blue-600 underline">
                              Know more
                            </span>
                          </>
                        ) : (
                          option.description
                        )}
                      </p>
                    )}
                    {option.note && (
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <span className="text-blue-500">ℹ️</span>
                        {option.note}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="border p-4 rounded bg-white shadow">
        {!globalLoading && !showPlaceOrder && (
          <button
            onClick={() => {
              setGlobalLoading(true);
              setTimeout(() => {
                setGlobalLoading(false);
                setShowPlaceOrder(true);
              }, 3000);
            }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black w-full py-2 font-semibold rounded mb-4"
          >
            Proceed to Payment
          </button>
        )}

        {globalLoading && (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto animate-spin" />
          </div>
        )}

        {!globalLoading && (
          <>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>₹{cart.totalMrpPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>₹80.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{(cart.totalMrpPrice + 80).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Promotion Applied:</span>
                <span>
                  ₹
                  {(
                    cart.totalMrpPrice - cart.totalDiscountedPrice
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Instant Bank Discount:</span>
                <span>-₹50.01</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Order Total:</span>
                <span>
                  ₹{(cart.totalDiscountedPrice + 80 - 50.01).toFixed(2)}
                </span>
              </div>
            </div>
            {showPlaceOrder ? (
              <button
                onClick={handlePlaceOrder}
                className="mt-4 w-full bg-green-500 hover:bg-green-400 text-black py-2 rounded font-semibold"
              >
                Place your order
              </button>
            ) : (
              ""
            )}
          </>
        )}
      </div>

      {showOverlay && <Overlay onClose={() => setShowOverlay(false)} />}
    </div>
  );
};

export default CheckoutComp;
