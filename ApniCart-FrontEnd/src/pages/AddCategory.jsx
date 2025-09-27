import React from 'react'
import AddCategoryComp from '../components/AddCategoryComp'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function AddCategory() {
  return (
    <div>
    <Navbar/>
    <div className='mt-40'>
    <AddCategoryComp/>
    </div>
    <div className='mt-30'>
    <Footer/>
    </div>
  </div>

  )
}

export default AddCategory
