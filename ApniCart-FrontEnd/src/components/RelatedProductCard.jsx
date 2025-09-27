import React from "react";
import { FaStar } from "react-icons/fa";

const RelatedProductCard = ({
  productName,
  rating,
  productMrp,
  productDiscount,
  discountedPrice,
  productQnt,
  productImage,
}) => {
  const boughtCount = productQnt * 5;

  return (
    <div className="bg-white rounded-lg shadow p-3 w-full sm:w-[45%] md:w-[220px] xl:w-[250px] flex flex-col hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <img
        src={productImage}
        alt={productName}
        className="w-full h-40 object-contain mb-3"
      />

      {/* Product Name */}
      <h2 className="text-base font-semibold text-gray-800 truncate">
        {productName}
      </h2>

      {/* Rating */}
      <div className="flex items-center text-sm mt-1">
        <span className="text-yellow-500 flex items-center">
          {rating.toFixed(1)} <FaStar className="ml-1" />
        </span>
        <span className="ml-2 text-gray-500">({Math.floor(rating * 10)})</span>
      </div>

      {/* Bought info */}
      <p className="text-xs text-gray-600 mt-1">
        {boughtCount}+ bought in past month
      </p>

      {/* Discount Label */}
      <div className="inline-block mt-2 text-xs bg-red-600 text-white px-2 py-1 rounded-sm font-medium w-fit">
        Limited time deal
      </div>

      {/* Pricing */}
      <div className="mt-2 text-lg font-bold text-gray-900">
        ₹{discountedPrice.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500 line-through">
        M.R.P: ₹{productMrp.toLocaleString()}
      </div>
      <div className="text-xs text-green-600 font-semibold">
        ({productDiscount}% off)
      </div>

      {/* Delivery */}
      <div className="text-xs mt-1 text-gray-700">
        FREE delivery within 2-3 days
      </div>

      {/* Add to Cart Button */}
      <button className="bg-yellow-400 mt-3 py-1 rounded hover:bg-yellow-500 text-sm font-medium w-full">
        Add to cart
      </button>
    </div>
  );
};

export default RelatedProductCard;
