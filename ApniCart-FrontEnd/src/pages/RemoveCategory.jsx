import React from 'react'
import RemoveCategoryComp from '../components/RemoveCategoryComp'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function RemoveCategory() {
  return (
    <div>
    <Navbar/>
    <div className='mt-40'>
    <RemoveCategoryComp/>
    </div>
    <div className='mt-30'>
    <Footer/>
    </div>
  </div>

  )
}

export default RemoveCategory
