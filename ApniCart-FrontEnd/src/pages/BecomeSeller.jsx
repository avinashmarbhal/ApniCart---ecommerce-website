import React from 'react'
import BecomeSellerComp from '../components/BecomeSellerComp'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function BecomeSeller() {
  return (
     <div>
        <Navbar/>
        <div className='mt-60'>
        <BecomeSellerComp/>
        </div>
        <div className='-mt-30'>
        <Footer/>
        </div>
      </div>
  )
}

export default BecomeSeller
