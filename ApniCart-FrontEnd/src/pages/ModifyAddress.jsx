import React from 'react'
import AddressList from "../components/AddressList"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function ModifyAddress() {
  return (
    <div>
      <Navbar/>
      <div className='mt-28'>
      <AddressList closeBtn={false}/>
      </div>
      <div className='-mt-20'>
      <Footer/>
      </div>
    </div>
  )
}

export default ModifyAddress
