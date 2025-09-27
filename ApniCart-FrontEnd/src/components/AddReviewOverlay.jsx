import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
const api = import.meta.env.VITE_API_URL;
const AddReviewOverlay = ({ productId, onClose, onReviewAdded }) => {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if(!user)
    {
      navigate("/login")
    }
    else
    {
      try {
      setLoading(true);
      const res = await axios.post(
        `${api}/review/addReview`,
        {
          product: productId,
          rating,
          comment,
        },
        { withCredentials: true }
      );
      toast.success("✅ Review added");
      onReviewAdded();
      onClose();
    } catch (err) {
      if (err?.response?.data?.err) {
        toast.error("❌ " + err.response.data.err);
      } else {
        toast.error("❌ Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
    }
  
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold text-gray-600"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Add a Review</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Rating</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                onClick={() => setRating(i + 1)}
                className="cursor-pointer text-2xl"
              >
                {i < rating ? (
                  <AiFillStar className="text-yellow-500" />
                ) : (
                  <AiOutlineStar className="text-yellow-500" />
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows="4"
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded w-full"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default AddReviewOverlay;
