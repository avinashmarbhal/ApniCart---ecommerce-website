import React from 'react'
import AddSubcategoryComp from '../components/AddSubcategoryComp'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function AddSubcategory() {
  return (
    <div>
    <Navbar/>
    <div className='mt-40'>
    <AddSubcategoryComp/>
    </div>
    <div className='mt-30'>
    <Footer/>
    </div>
  </div>

  )
}

export default AddSubcategory
