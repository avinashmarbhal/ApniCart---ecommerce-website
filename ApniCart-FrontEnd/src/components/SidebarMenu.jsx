import React from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import useCategoryData from "../hooks/useCategoryData";

const SidebarMenu = ({ open, setOpen }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const { categories, subcategories } = useCategoryData();

  // Group subcategories by parentCategory (categoryId)
  const groupedSubcategories = subcategories.reduce((acc, sub) => {
    if (!acc[sub.parentCategory]) acc[sub.parentCategory] = [];
    acc[sub.parentCategory].push(sub);
    return acc;
  }, {});

  const handleLogin = () => {
    navigate("/login");
    setOpen(false);
  };

  const handleSignUp = () => {
    navigate("/signup");
    setOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 p-4 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative">
          <div className="text-2xl font-bold mb-4 text-white bg-gray-700 rounded-b-sm p-4">
            Hello, {user?.firstName || "Guest"}
          </div>
          <button
            className="absolute top-5 right-5 text-white text-xl"
            onClick={() => setOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 text-xl">
            Shop by Category
          </h3>
          <ul className="text-gray-800 space-y-2 mt-3 ml-2">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  to={`/searchCategory/${cat._id}`}
                  onClick={() => setOpen(false)}
                  className="hover:underline"
                >
                  <span className="font-medium">{cat.name}</span>
                  {groupedSubcategories[cat._id]?.length > 0 && (
                    <span className="ml-1 text-gray-600">
                      :{" "}
                      {groupedSubcategories[cat._id]
                        .map((sub) => sub.name)
                        .join(", ")}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help & Settings */}
        <div>
          <h3 className="font-semibold text-gray-900 text-xl">
            Help & Settings
          </h3>
          <ul className="text-gray-800 space-y-2 mt-3 ml-2">
            <li>Your Account</li>
            <li>Customer Service</li>
            {user ? (
              <LogoutButton onClose={() => setOpen(false)} />
            ) : (
              <>
                <li
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={handleLogin}
                >
                  Sign In
                </li>
                <li
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={handleSignUp}
                >
                  Sign Up
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
