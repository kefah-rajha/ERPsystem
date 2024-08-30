import React from 'react'
import NavbarItems from "@/components/header/navbarItems"

function Navbar() {
  return (
    <div className="h-14 w-full bg-[#272727]  container barShadow flex justify-center items-center ">
      <h3 className="text-3xl font-bold w-1/2 text-right "><span className="font-light">ERP</span>system</h3>
      <div className='w-1/2'><NavbarItems/></div>

    </div>
  )
}

export default Navbar


