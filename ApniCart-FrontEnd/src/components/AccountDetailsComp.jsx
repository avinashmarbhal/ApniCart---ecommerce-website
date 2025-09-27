import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
const api = import.meta.env.VITE_API_URL;

function AccountDetailsComp() {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true); // assume true unless changed
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If email is changed, reset verification flags
    if (name === "email" && value !== user.email) {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp("");
    }
  };

  const checkEmailAndSendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/checkEmailExists/${formData.email}`);
      if (res.data.msg === "No account found with this email.") {
        const otpRes = await axios.post(
          `${api}/sendOtpController/${user.email}?email2=${formData.email}`
        );
        if (otpRes.data.msg === "OTP sent to email") {
          toast.success("✅ OTP sent to new email");
          setOtpSent(true);
        } else {
          toast.error("❌ Failed to send OTP");
        }
      } else {
        toast.error("❌ Account with this email already exists");
      }
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.msg || "❌ Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("❌ Enter OTP");

    setLoading(true);
    try {
      const res = await axios.patch(
        `${api}/verifyOtpController/${user.email}`,
        { type: "email", otp }
      );
      if (res.data.msg === "Otp verified successfully") {
        toast.success("✅ Email verified");
        setEmailVerified(true);
        setOtpSent(false); // hide OTP input after success
      } else {
        toast.error("❌ OTP verification failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "❌ Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!emailVerified && formData.email !== user.email) {
      return toast.error("❌ Verify new email first");
    }

    setLoading(true);
    try {
      await axios.patch(`${api}/updateUser`, formData, {
        withCredentials: true,
      });
      toast.success("✅ Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Account Information
      </h2>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border ${
              isEditing ? "border-purple-400" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-400`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border ${
              isEditing ? "border-purple-400" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-400`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border ${
              isEditing ? "border-purple-400" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-400`}
          />
          {isEditing &&
            formData.email !== user.email &&
            !emailVerified &&
            !otpSent && (
              <button
                onClick={checkEmailAndSendOtp}
                className="mt-2 text-sm text-blue-600 underline"
                disabled={loading}
              >
                Send OTP to new email
              </button>
            )}
        </div>

        {/* OTP Box */}
        {otpSent && !emailVerified && (
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleVerifyOtp}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded border ${
              isEditing ? "border-purple-400" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-400`}
          />
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-4">
        {isEditing ? (
          <>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phoneNo: user.phoneNo,
                });
                setEmailVerified(true);
                setOtpSent(false);
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={
                loading || (!emailVerified && formData.email !== user.email)
              }
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold rounded"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default AccountDetailsComp;
