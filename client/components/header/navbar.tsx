"use client"
import React from 'react'
import NavbarItems from "@/components/header/navbarItems"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from '@/context/AuthContext';


function Navbar() {
  const { user } = useAuth();
  console.log(user,"user navbar")

  return (
    <div className="h-14 w-full bg-[#272727]  container barShadow flex justify-center items-center ">
      <SidebarTrigger  />
      <h3 className="text-3xl font-bold w-1/2 text-right "><span className="font-light">ERP</span>system</h3>
             
      <div className='w-1/2'>{ user && <NavbarItems user={user}/>}</div>

    </div>
  )
}

export default Navbar


