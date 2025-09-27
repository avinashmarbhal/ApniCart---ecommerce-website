import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SProducts from '../components/SProducts'

function SearchProducts() {
  return (
    <div>
    <Navbar/>
    <div className='mt-28'>
    <SProducts/>
    </div>
    <div className='-mt-20'>
    <Footer/>
    </div>
  </div>
  )
}

export default SearchProducts
