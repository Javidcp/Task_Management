import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const DashboradLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default DashboradLayout