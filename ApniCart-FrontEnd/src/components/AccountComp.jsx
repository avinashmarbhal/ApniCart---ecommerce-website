import React from "react";
import {
  FaBox,
  FaMapMarkerAlt,
  FaLock,
  FaPhone,
  FaPlus,
  FaEdit,
  FaUserTie,
  FaClipboardList,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AccountComp = () => {
  const defaultAddress = useSelector((state) => state.address.address);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "user";

  const userAccountOptions = [
    {
      icon: <FaBox className="text-2xl text-orange-500" />,
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      link: "/orders",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-yellow-500" />,
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      link: defaultAddress ? "/modify-address" : "/add-address",
    },
    {
      icon: <FaLock className="text-2xl text-blue-600" />,
      title: "Login & Security",
      desc: "Edit login, name, and mobile number",
      link: "/account-details",
    },
    {
      icon: <FaUserTie className="text-2xl text-purple-600" />,
      title: "Become Seller on ApniCart",
      desc: "Start selling your products",
      link: "/become-seller",
    },
    {
      icon: <FaPhone className="text-2xl text-green-500" />,
      title: "Contact Us",
      desc: "Reach our customer support team",
      link: "/contact",
    },
  ];

  const sellerAccountOptions = [
    {
      icon: <FaPlus className="text-2xl text-green-600" />,
      title: "Add New Product",
      desc: "List your new products",
      link: "/add-product",
    },
    {
      icon: <FaEdit className="text-2xl text-blue-500" />,
      title: "Update/Delete Product",
      desc: "Manage existing products",
      link: "/manage-product",
    },
    {
      icon: <FaLock className="text-2xl text-blue-600" />,
      title: "Login & Security",
      desc: "Edit login, name, and mobile number",
      link: "/account-details",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-yellow-500" />,
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      link: "/add-address",
    },
    {
      icon: <FaPhone className="text-2xl text-green-500" />,
      title: "Contact Us",
      desc: "Reach our customer support team",
      link: "/contact",
    },
  ];

  const adminAccountOptions = [
    {
      icon: <FaPlus className="text-2xl text-green-600" />,
      title: "Add New Category",
      desc: "Create a new product category",
      link: "/admin/add-category",
    },
    {
      icon: <FaEdit className="text-2xl text-blue-500" />,
      title: "Update/Delete Category",
      desc: "Manage existing categories",
      link: "/admin/manage-category",
    },
    {
      icon: <FaPlus className="text-2xl text-green-600" />,
      title: "Add New SubCategory",
      desc: "Create a new subcategory",
      link: "/admin/add-subcategory",
    },
    {
      icon: <FaEdit className="text-2xl text-blue-500" />,
      title: "Update/Delete SubCategory",
      desc: "Manage existing subcategories",
      link: "/admin/manage-subcategory",
    },
    {
      icon: <FaClipboardList className="text-2xl text-orange-600" />,
      title: "Seller Requests",
      desc: "Approve new sellers",
      link: "/admin/seller-requests",
    },
    {
      icon: <FaLock className="text-2xl text-blue-600" />,
      title: "Login & Security",
      desc: "Manage your credentials",
      link: "/account-details",
    },
    {
      icon: <FaPhone className="text-2xl text-green-500" />,
      title: "Contact Us",
      desc: "Reach our customer support team",
      link: "/contact",
    },
  ];

  const optionsByRole = {
    user: userAccountOptions,
    seller: sellerAccountOptions,
    admin: adminAccountOptions,
  };

  const options = optionsByRole[role] || userAccountOptions;

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 md:px-12 mt-20">
      <h1 className="text-3xl font-bold mb-10 text-center sm:text-left ">
        Your Account
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center space-x-4 mb-2">
              {item.icon}
              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountComp;
