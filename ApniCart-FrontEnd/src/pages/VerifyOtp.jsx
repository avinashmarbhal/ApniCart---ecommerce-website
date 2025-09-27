import React from 'react'
import Navbar from '../components/Navbar'
import VerifyOtpComp from '../components/VerifyOtpComp'
import SimpleFooter from '../components/SimpleFooter'
import logo from '../assets/logo-trans.png';


export default function VerifyOtp() {
  return (
    <div>
         <div className="bg-gray-50 ">
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-15 -mb-40">
        <img src={logo} alt="ApniCart Logo"  className="w-60 h-22 object-cover overflow-hidden" />
        <VerifyOtpComp/>
      </div>
      <SimpleFooter />
    </div>
    </div>
  )
}
