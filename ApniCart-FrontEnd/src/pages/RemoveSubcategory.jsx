import React from 'react'
import RemoveSubcategoryComp from '../components/RemoveSubcategoryComp'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function RemoveSubcategory() {
  return (
    <div>
    <Navbar/>
    <div className='mt-40'>
    <RemoveSubcategoryComp/>
    </div>
    <div className='mt-30'>
    <Footer/>
    </div>
  </div>
  )
}

export default RemoveSubcategory
