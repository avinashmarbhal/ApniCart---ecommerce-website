import React, { useState } from "react";
import { FaEnvelope, FaPinterest, FaFacebook, FaXmark } from "react-icons/fa6";

const ShareProductOverlay = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
      onClose(); // Close overlay after 1s
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-700">
          <FaXmark size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Share this product with friends</h2>

        {/* Icons */}
        <div className="flex justify-around text-2xl mb-4">
          <FaEnvelope className="hover:text-red-500 cursor-pointer" />
          <FaPinterest className="hover:text-pink-500 cursor-pointer" />
          <FaFacebook className="hover:text-blue-600 cursor-pointer" />
          <FaXmark className="hover:text-black cursor-pointer" />
        </div>

        {/* Share Link */}
        <div className="flex items-center border rounded px-3 py-2 text-sm">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-grow outline-none"
          />
          <button
            onClick={handleCopy}
            className={`ml-3 px-2 py-1 rounded ${
              copied ? "bg-green-400" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareProductOverlay;
