import React from 'react'
import Navbar from './Navbar/Navbar'
import { Outlet } from 'react-router'
function Layout() {
  return (
    <>
        <div><Navbar/></div>
        <div>
            <Outlet/>
        </div>
    </>
  )
}

export default Layout
