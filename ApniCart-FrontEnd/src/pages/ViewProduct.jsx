import React from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ViewProductComp from '../components/ViewProductComp'

function ViewProduct() {
    const { id } = useParams()
  return (
    <div>
      <Navbar/>
      <div className='mt-28'>
      <ViewProductComp  />
      </div>
      <div className='-mt-20'>
      <Footer/>
      </div>
    </div>
  )
}

export default ViewProduct
