// components/LogoutButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../features/user/userSlice";
import { clearCart } from "../features/cart/cartSlice";
import { clearAddress } from "../features/address/addressSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
const api = import.meta.env.VITE_API_URL;
const LogoutButton = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${api}/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
      dispatch(clearCart());
      dispatch(clearAddress());
      localStorage.removeItem("apniUser");
      onClose?.(); // close sidebar/dropdown etc.
      navigate("/", {
        state: { msg: res.data.msg || "Logged out successfully!" },
      });
      toast.success("Logout successful!");
    } catch (err) {
      console.error(err.response?.data?.msg || "Logout failed");
    }
  };

  return (
    <li
      className="cursor-pointer text-red-600 hover:underline"
      onClick={handleLogout}
    >
      Sign Out
    </li>
  );
};

export default LogoutButton;
