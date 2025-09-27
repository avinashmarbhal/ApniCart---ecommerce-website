import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAddress } from "../features/address/addressSlice";
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_API_URL;

const AddAddressForm = () => {
  const defaultAddress = useSelector((state) => state.address.address);
  const query = new URLSearchParams(useLocation().search);
  const navigateTo = query.get("navi");
  const dispatch = useDispatch();
  const navigaet = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    pinCode: "",
    houseNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    addressType: "Home",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${api}/address/addAddress`, formData, {
        withCredentials: true,
      });

      const newDefaultAddress = res.data.defaultAddress;

      dispatch(setAddress(newDefaultAddress)); // ✅ Update Redux

      toast.success("✅ Address added successfully!");

      setFormData({
        fullName: "",
        mobileNumber: "",
        pinCode: "",
        houseNumber: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        country: "",
        addressType: "Home",
        isDefault: false,
      });
      navigaet(`${navigateTo}`);
    } catch (error) {
      toast.error("❌ Failed to add address. Please try again.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-[#f3f3f3] rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Add New Address</h2>

      {[
        { name: "fullName", label: "Full Name" },
        { name: "mobileNumber", label: "Mobile Number" },
        { name: "pinCode", label: "Pin Code" },
        { name: "houseNumber", label: "House Number" },
        { name: "street", label: "Street" },
        { name: "landmark", label: "Landmark" },
        { name: "city", label: "City" },
        { name: "state", label: "State" },
        { name: "country", label: "Country" },
      ].map(({ name, label }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <input
            type="text"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address Type
        </label>
        <select
          name="addressType"
          value={formData.addressType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          id="isDefault"
          className="h-4 w-4 text-yellow-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded shadow"
      >
        Add Address
      </button>
    </form>
  );
};

export default AddAddressForm;
