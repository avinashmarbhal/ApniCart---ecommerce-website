import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
const api = import.meta.env.VITE_API_URL;
const VerifyOtpComp = () => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(
        `${api}/verifyOtpController`,
        {
          otp,
          type: "email",
        },
        { withCredentials: true }
      );

      if (res.data?.msg === "Email verified successfully") {
        dispatch(setUser(res.data?.user));
        console.log("&&&&&&&&&&&&&&&&&&");
        console.log(res.data?.user);
        console.log(res);
        console.log("&&&&&&&&&&&&&&&&&&");

        
        localStorage.setItem("apniUser", JSON.stringify(res.data?.user));
        toast.success("Email verified successfully!");
        navigate("/");
      } else {
        toast.error("Verification failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center  pt-2  w-120 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-md border border-gray-300"
      >
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
          Verify OTP
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Enter OTP sent to your email
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Verify"
          )}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpComp;
