import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import NoRequest from "../assets/NoRequest.json";
import Lottie from "lottie-react";

const api = import.meta.env.VITE_API_URL;

const SellerRequestsComp = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/admin/getAllSellerRequests`, {
        withCredentials: true,
      });
      setRequests(res.data.users || []);
    } catch (err) {
      toast.error("❌ Failed to fetch seller requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoadingId(userId);
    try {
      const res = await axios.patch(
        `${api}/admin/approveSeller/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success("✅ " + res.data.msg);
      fetchRequests();
    } catch {
      toast.error("❌ Failed to approve request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDisapprove = async (userId) => {
    setActionLoadingId(userId);
    try {
      const res = await axios.patch(
        `${api}/admin/disapproveSeller/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success("🚫 " + res.data.msg);
      fetchRequests();
    } catch {
      toast.error("❌ Failed to disapprove request");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        🧾 Seller Requests
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Lottie animationData={NoRequest} loop className="h-60 w-50" />
          <p className="text-xl sm:text-2xl text-gray-600 mt-4 text-center">
            No pending seller requests.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-yellow-300 rounded-lg p-4 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* User Info */}
                <div className="space-y-1 text-sm sm:text-base">
                  <p className="text-lg font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-600 break-words">{user.email}</p>
                  <p className="text-gray-600">📞 {user.phoneNo}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm">
                    <span
                      className={`${
                        user.isEmailVerified ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      📧 Email:{" "}
                      {user.isEmailVerified ? "Verified" : "Not Verified"}
                    </span>
                    <span
                      className={`${
                        user.isPhoneVerified ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      📱 Phone:{" "}
                      {user.isPhoneVerified ? "Verified" : "Not Verified"}
                    </span>
                    <span className="text-blue-700">
                      📝 Status:{" "}
                      <span className="capitalize font-medium">
                        {user.sellerRequestStatus}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 sm:flex-col sm:gap-3 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleApprove(user._id)}
                    disabled={actionLoadingId === user._id}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
                  >
                    {actionLoadingId === user._id ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleDisapprove(user._id)}
                    disabled={actionLoadingId === user._id}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
                  >
                    {actionLoadingId === user._id
                      ? "Disapproving..."
                      : "Disapprove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerRequestsComp;
