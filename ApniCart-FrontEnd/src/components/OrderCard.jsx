import React, { useState } from "react";
import { Link } from "react-router-dom";
import TrackPackageOverlay from "./TrackPackageOverlay";
import AddReviewOverlay from "./AddReviewOverlay";
import axios from "axios";
import { toast } from "react-hot-toast";
const api = import.meta.env.VITE_API_URL;

const OrderCard = ({ order }) => {
  const {
    shippingAddress,
    createdAt,
    finalAmount,
    items,
    _id,
    orderStatus,
    paymentMethod,
  } = order;

  const [showTracking, setShowTracking] = useState(false);
  const [reviewModal, setReviewModal] = useState({
    show: false,
    productId: null,
  });

  const orderDate = new Date(createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border rounded shadow bg-white p-4 mb-6 hover:shadow-md relative">
      {/* Top Section */}
      <div className="flex flex-wrap justify-between gap-4 text-sm text-gray-700 mb-3">
        <div>
          <p className="text-gray-500">ORDER PLACED</p>
          <p className="font-medium">{orderDate}</p>
        </div>
        <div>
          <p className="text-gray-500">TOTAL</p>
          <p className="font-medium">₹{finalAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">SHIP TO</p>
          <p className="font-medium">{shippingAddress.fullName}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">ORDER #{_id.slice(-10)}</p>
          <Link
            to={`/order/details/${_id}`}
            className="text-blue-600 hover:underline"
          >
            View order details
          </Link>
        </div>
      </div>

      <hr className="mb-3" />

      {/* Product List */}
      {items.map(({ product, quantity }) => (
        <div
          key={product._id}
          className="flex flex-col md:flex-row md:items-start gap-4 mb-4"
        >
          <img
            src={product.productImage?.url}
            alt={product.productName}
            className="w-28 h-28 object-contain border rounded mx-auto md:mx-0"
          />
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <Link
                to={`/viewproduct/${product._id}`}
                className="block max-w-full md:max-w-[70%]"
              >
                <h3 className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                  {product.productName}
                </h3>
              </Link>
              {orderStatus === "delivered" && (
                <button
                  className="text-sm border rounded px-2 py-1 mt-2 md:mt-0 hover:bg-gray-100 self-start"
                  onClick={() =>
                    setReviewModal({ show: true, productId: product._id })
                  }
                >
                  Leave seller feedback
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">Quantity: {quantity}</p>
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span
                className={`font-medium capitalize ${
                  orderStatus === "cancelled"
                    ? "text-red-700"
                    : "text-green-700"
                }`}
              >
                {orderStatus}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Payment:{" "}
              <span className="font-medium text-blue-700">
                {paymentMethod}
              </span>
            </p>
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-3 mt-4 text-sm">
        <button className="bg-yellow-400 hover:bg-yellow-300 w-full md:w-auto py-2 px-4 rounded">
          Get product support
        </button>
        <button
          className="border w-full md:w-auto py-2 px-4 rounded hover:bg-gray-200"
          onClick={() => setShowTracking(true)}
        >
          Track package
        </button>
      </div>

      {/* Tracking Overlay */}
      {showTracking && (
        <TrackPackageOverlay
          currentStatus={orderStatus}
          onClose={() => setShowTracking(false)}
        />
      )}

      {/* Review Overlay */}
      {reviewModal.show && (
        <AddReviewOverlay
          productId={reviewModal.productId}
          onClose={() => setReviewModal({ show: false, productId: null })}
          onReviewAdded={() =>
            axios
              .get(
                `${api}/review/getAllReviewsByProductId/${reviewModal.productId}`
              )
              .then(() => {
                toast.success("✅ Review updated!");
                setReviewModal({ show: false, productId: null });
              })
              .catch(() => toast.error("❌ Failed to load reviews"))
          }
        />
      )}
    </div>
  );
};

export default OrderCard;
