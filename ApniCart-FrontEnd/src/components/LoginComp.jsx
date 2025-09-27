import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { toast } from "react-hot-toast";
// import useAppInit from "../hooks/useAppInit";
const api = import.meta.env.VITE_API_URL;

const LoginComp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${api}/login`, formData, {
        withCredentials: true,
      });

      const user = res.data.loggedInUser;
      dispatch(setUser(user));
      localStorage.setItem("apniUser", JSON.stringify(user));
      console.log(user);
      console.log(user.isEmailVerified);

      if (!user.isEmailVerified) {
        const otpRes = await axios.post(
          `${api}/sendOtpController`,
          { email: user.email },
          { withCredentials: true }
        );

        if (otpRes.data.msg === "OTP sent to email") {
          toast.success("OTP sent to your email. Please verify.");
          navigate("/verifyOtp");
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      } else {
        
      toast.success("Login successful!");
      }
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.error || "Login failed");
      
    } finally {
      setLoading(false);
    }
  };

  return (
              // "min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8"
    <div className="flex justify-center items-center pt-2  bg-gray-100 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-6 sm:p-8 rounded-md shadow-md border border-gray-300"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-6 text-center">
          Sign-In
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autocomplete="current-password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded transition duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-xs text-gray-600 mt-4 text-center">
          By continuing, you agree to ApniCart's Terms of Service and Privacy Policy.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-blue-600 font-medium gap-2 sm:gap-0">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="hover:underline"
          >
            Create your ApniCart account
          </button>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginComp;
