import React from 'react'
import CartComp from '../components/CartComp'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Cart() {
  return (
    <div>
    <Navbar/>
    <div className='mt-48 sm:mt-28 md:mt-28'>
    <CartComp/>
    </div>
    <div className='-mt-20'>
    <Footer/>
    </div>
  </div>
  )
}  

export default Cart
