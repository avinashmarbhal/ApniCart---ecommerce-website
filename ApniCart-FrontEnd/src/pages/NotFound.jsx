// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-trans.png"; 

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      {/* Logo */}
      <img
        src={logo}
        alt="ApniCart Logo"
        className="w-9150 h-70 object-contain -mt-50"
      />

      {/* 404 Text */}
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Looking for something?</h2>
      <p className="text-gray-600 mb-4 max-w-lg">
        We're sorry. The web address you entered is not a functioning page on our site.
      </p>

      {/* Go Home Link */}
      <Link
        to="/"
        className="text-blue-600 underline text-lg hover:text-blue-800"
      >
        Go to ApniCart's Home Page
      </Link>
    </div>
  );
};

export default NotFound;
