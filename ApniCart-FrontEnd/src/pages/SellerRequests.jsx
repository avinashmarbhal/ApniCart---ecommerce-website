import React from 'react'
import SellerRequestsComp from '../components/SellerRequestsComp'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function SellerRequests() {
  return (
    <div>
    <Navbar />
    <div className="mt-28">
    <SellerRequestsComp/>
    </div>
    <div className="mt-30">
      <Footer />
    </div>
  </div>
  )
}

export default SellerRequests
