import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import logo from "../assets/logo-trans.png";
const api = import.meta.env.VITE_API_URL;
const SignupComp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${api}/signup`, formData, {
        withCredentials: true,
      });

      if (res.data.message === "Account created successfully") {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center md:w-full justify-center bg-white px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-5 rounded-md shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-[#131921] mb-6 text-center">
          Create Account
        </h2>

        {["firstName", "lastName", "email", "phoneNo", "password"].map(
          (field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
                {field === "phoneNo" ? "Phone Number" : field}
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          )
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center bg-yellow-400 hover:bg-yellow-500 text-[#131921] font-semibold py-2 px-4 rounded-md transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupComp;
