import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_API_URL;
const ForgotPasswordComp = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // in seconds
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (otpSent && !otpVerified && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [otpSent, otpVerified, timer]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      return toast.error("❌ Please enter a valid email");
    }

    setLoading(true);
    try {
      const res = await axios.post(`${api}/sendOtpController/${email}`);
      if (res.data.msg === "OTP sent to email") {
        toast.success("✅ " + res.data.msg);
        setOtpSent(true);
        setTimer(300); // 5 minutes
      } else {
        toast.error("❌ Something went wrong");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "❌ User not found");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("❌ Please enter OTP");
    if (timer <= 0) return toast.error("❌ OTP expired. Please resend.");

    setLoading(true);
    try {
      const res = await axios.patch(`${api}/verifyOtpController/${email}`, {
        type: "email",
        otp,
      });

      if (res.data.msg === "Otp verified successfully") {
        toast.success("✅ OTP Verified!");
        setOtpVerified(true);
      } else {
        toast.error("❌ OTP Verification failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "❌ Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !rePassword) {
      return toast.error("❌ Please fill in all password fields");
    }

    if (newPassword !== rePassword) {
      return toast.error("❌ Passwords do not match");
    }

    setLoading(true);
    try {
      await axios.patch(`${api}/updatePass`, {
        email,
        newpassword: newPassword,
      });

      toast.success("✅ Password updated successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "❌ Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-2 sm:w-130 mt-20 bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
          Forgot Password
        </h2>

        {!otpSent && (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded shadow ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        )}

        {otpSent && !otpVerified && (
          <>
            <div className="mb-4 mt-6">
              <label className="block mb-1 font-medium text-gray-700">
                Enter OTP{" "}
                {timer > 0 && (
                  <span className="text-xs text-gray-500">
                    (expires in {formatTime(timer)})
                  </span>
                )}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                disabled={timer <= 0}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {timer <= 0 && (
                <p className="text-red-500 text-sm mt-1">
                  OTP expired. Please refresh the page and try again.
                </p>
              )}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading || timer <= 0}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded shadow ${
                loading || timer <= 0 ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        )}

        {otpVerified && (
          <>
            <div className="mb-4 mt-6">
              <label className="block mb-1 font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded shadow ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Update Password"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordComp;
