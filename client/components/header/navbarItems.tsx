"use client"
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown ,BellIcon,Scan} from 'lucide-react';
import { Button } from '../ui/button';
import Link from "next/link"
import { useAuth } from '@/context/AuthContext';

interface NavbarItemsProps {
  _id:string;
  userName:string
  password: string;
  name:string;
  Brithday:Date;
  createdAt: Date,
  role:string,
  refreshToken?: string;
}

function NavbarItems({user}:any) {
  const {logout}=useAuth()
  
  return (
    <div className='flex justify-end items-center gap-4'>
      <div>    <Scan className="h-6 w-6 cursor-pointer hover:text-orange-400"/>
      </div>
      <div>
      <div className="relative inline-block">
      <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ED6F6F] text-foreground ">
        <span className="text-sm font-medium ">12</span>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-transparent">
        <BellIcon className="h-6 w-6 hover:text-orange-400" />
        <span className="sr-only ">Notifications</span>
      </Button>
    </div>
      </div>
      <div>
      <DropdownMenu > 
  <DropdownMenuTrigger className='flex items-center gap-1'><p className='font-bold Justglow'>{user.userName}</p> <ChevronDown className='w-4 h-4 Justglow'/>

  </DropdownMenuTrigger>
  <DropdownMenuContent className='bg-[#2F2F2F] mt-2'>
        <DropdownMenuItem>
          <Link href="/dashboard/profile">Profile</Link>
          </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={()=>logout()}>Log Out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
      </div>


    </div>
  )
}

export default NavbarItems