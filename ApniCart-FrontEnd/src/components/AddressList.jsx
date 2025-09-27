import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAddress } from "../features/address/addressSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
const api = import.meta.env.VITE_API_URL;
const AllAddresses = ({ onClose, closeBtn = true }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAddresses = async () => {
  
    try {
      setLoading(true);
      const res = await axios.get(`${api}/address/getAllAddresses`, {
        withCredentials: true,
      });
      setAddresses(res.data.addresses);
      const defaultAddr = res.data.addresses.find((addr) => addr.isDefault);
      setSelectedId(defaultAddr?._id);
    } catch (err) {
      
      // toast.error("❌ Failed to load addresses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDefaultChange = async (id) => {
    setChangingId(id);
    try {
      const res = await axios.patch(
        `${api}/address/setDefaultAddress/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(setAddress(res.data.defaultAddress));
      toast.success("✅ Default address updated");
      setSelectedId(id);

      if (closeBtn) onClose();

      fetchAddresses();
    } catch (err) {
      toast.error("❌ Failed to update default address.");
      console.error(err);
    } finally {
      setChangingId(null);
    }
  };

  const handleDelete = async (id) => {
    setChangingId(id);
    try {
      const res = await axios.delete(`${api}/address/removeAddress/${id}`, {
        withCredentials: true,
      });
      dispatch(setAddress(res.data.defaultAddress));
      toast.success("🗑️ Address deleted");
      fetchAddresses();
    } catch (err) {
      toast.error("❌ Failed to delete address.");
      console.error(err);
    } finally {
      setChangingId(null);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-6 min-h-[300px]">
      {/* Close button */}
      {closeBtn && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          <IoClose />
        </button>
      )}

      <h2 className="text-2xl font-bold mb-4 pr-10">Choose your location</h2>

      {/* Skeleton loader */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 border border-gray-300 rounded-lg p-4 h-[120px]"
            />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <p className="text-gray-600">No addresses found.</p>
      ) : (
        addresses.map((address) => (
          <div
            key={address._id}
            onClick={() =>
              changingId ? null : handleDefaultChange(address._id)
            }
            className={`cursor-pointer bg-white border rounded-lg p-4 mb-4 shadow-sm transition hover:shadow-md ${
              address._id === selectedId
                ? "border-yellow-500"
                : "border-gray-300 hover:border-yellow-400"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-lg">
                  {address.fullName} ({address.addressType})
                </div>
                <div className="text-gray-700 text-sm">
                  {address.houseNumber}, {address.street}, {address.landmark}
                  <br />
                  {address.city} - {address.pinCode}, {address.state},{" "}
                  {address.country}
                  <br />
                  📞 {address.mobileNumber}
                </div>
                {address.isDefault && (
                  <div className="text-green-600 font-semibold mt-1">
                    ✅ Default Address
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit-address/${address._id}`);
                  }}
                  className="text-blue-600 font-semibold hover:underline"
                  disabled={!!changingId}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(address._id);
                  }}
                  className="text-red-600 font-semibold hover:underline"
                  disabled={!!changingId}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Add New Address Button */}
      {!loading && (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(`/add-address?navi=${currentPath}`)}
            fd
            className="w-full max-w-md bg-gradient-to-t from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold py-2 px-4 rounded shadow"
          >
            + Add a New Address
          </button>
        </div>
      )}

      {/* Overlay Spinner when changing */}
      {changingId && (
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <svg
            className="animate-spin h-8 w-8 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AllAddresses;
