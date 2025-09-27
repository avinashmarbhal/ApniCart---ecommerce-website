import React from "react";
import Navbar from "../components/Navbar";
import SignupComp from "../components/SignupComp";
import logo from "../assets/logo-trans.png";
import SimpleFooter from "../components/SimpleFooter";

export default function SignUp() {
  return (
    <div className="bg-gray-50">
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-15">
       

        {/* Signup Component */}
        <SignupComp />
      
      </div>
      <SimpleFooter />
    </div>
  );
}
