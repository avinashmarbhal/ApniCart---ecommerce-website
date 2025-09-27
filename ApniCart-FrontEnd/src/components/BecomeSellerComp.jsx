import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setUser } from "../features/user/userSlice";

const api = import.meta.env.VITE_API_URL;

const BecomeSellerComp = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setRequestSent(user.sellerRequest || false);
      setStatus(user.sellerRequestStatus || null);
    }
  }, [user]);

  const handleSellerRequest = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(`${api}/requestSeller`, {}, { withCredentials: true });
      toast.success("✅ " + res.data.msg);
      setRequestSent(true);
      setStatus("pending");
      dispatch(setUser(res.data.user));
    } catch (err) {
      toast.error("❌ Failed to submit seller request");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(`${api}/cancelSellerRequest`, {}, { withCredentials: true });
      toast.success("🚫 " + res.data.msg);
      setRequestSent(false);
      setStatus(null);
      dispatch(setUser(res.data.user));
    } catch (err) {
      toast.error("❌ Failed to cancel request");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "verifyUser" || user.isSeller || requestSent === null) {
    return null;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6 sm:p-8 max-w-md sm:max-w-xl w-full mx-auto mt-6 border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 text-center sm:text-left">
        Become a Seller on ApniCart
      </h2>

      <p className="text-gray-600 mb-4 text-sm sm:text-base text-center sm:text-left">
        Start your seller journey and reach thousands of customers.
      </p>

      {requestSent ? (
        <>
          <div className="text-blue-700 font-medium mb-4 text-center sm:text-left">
            Seller Request Status: <span className="capitalize">{status}</span>
          </div>
          <div className="flex justify-center sm:justify-start">
            <button
              onClick={handleCancelRequest}
              disabled={loading}
              className={`border border-red-500 text-red-500 hover:bg-red-100 py-2 px-5 rounded font-medium transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Cancelling..." : "Cancel Request"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center sm:justify-start">
          <button
            onClick={handleSellerRequest}
            disabled={loading}
            className={`bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-5 rounded transition shadow ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Request to Become Seller"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BecomeSellerComp;
