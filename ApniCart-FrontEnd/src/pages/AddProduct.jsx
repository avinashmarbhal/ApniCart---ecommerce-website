import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddProductComp from '../components/AddProductComp'

export default function AddProduct() {
  return (
    <div>
      <Navbar/>
      <div className='mt-36 sm:mt-28'>
      <AddProductComp/>
      </div>
      <div className='-mt-20'>
      <Footer/>
      </div>
    </div>
  )
}
