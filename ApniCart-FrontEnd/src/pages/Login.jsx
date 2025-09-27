import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginComp from "../components/LoginComp";
import logo from "../assets/logo-trans.png";
import SimpleFooter from "../components/SimpleFooter";


function Login() {

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-15 -mb-30">
        {/* Logo */}
        <img
          src={logo}
          alt="ApniCart Logo"
          className="w-60 h-22 object-cover overflow-hidden"
        />

        {/* Login Component */}
        <LoginComp />
      </div>
      <SimpleFooter />
    </div>
  );
}

export default Login;
