import React from "react";
import LoginComp from "../components/LoginComp";
import { Link } from "react-router-dom";



export default function SwitchAccount() {
  return (
    <div className="bg-gray-50">
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-15 -mb-30">
        {/* Logo */}
        <div className="text-amber-400 text-4xl bold">SwitchAccount</div>

        {/* Login Component */}
        <LoginComp />
        <Link to="/" className="ml-100 p-2 bg-white -mt-11 mr-25 text-blue-500">Go to Home</Link>
      </div>
    </div>
  );
}
