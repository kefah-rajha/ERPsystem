"use client";
import React from "react";
import { AppWindowMac, CheckIcon, LayoutDashboardIcon, PinIcon, RepeatIcon, SettingsIcon, ShoppingCartIcon, StoreIcon, UserIcon } from "lucide-react";
import Link from "next/link";
function SidebarItems() {
  return (
    <div className="pt-6">
      <nav className="space-y-4 overflow-auto h-full">
          <Link href="/dashboard" className="flex m-0 items-center space-x-2 pl-2 hover:bg-[#313131] h-12 " style={{margin:"0"}} prefetch={false}>
            <LayoutDashboardIcon className="w-5 h-5 text-purple-400" />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/user" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12"style={{margin:"0"}} prefetch={false}>
            <UserIcon className="w-5 h-5 text-purple-400" />
            <span>User</span>
          </Link>
          {/* <Link href="#" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12 "style={{margin:"0"}} prefetch={false}>
            <StoreIcon className="w-5 h-5 text-purple-400" />
            <span>Products</span>
          </Link> */}
          {/* <Link href="#" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12"style={{margin:"0"}} prefetch={false}>
            <ShoppingCartIcon className="w-5 h-5 text-purple-400" />
            <span>Purchase</span>
          </Link> */}
          {/* <Link href="#" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12"style={{margin:"0"}} prefetch={false}>
            <StoreIcon className="w-5 h-5 text-purple-400" />
            <span>Sales</span>
          </Link> */}
          {/* <Link href="#" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12"style={{margin:"0"}} prefetch={false}>
            <StoreIcon className="w-5 h-5 text-purple-400" />
            <span>Sales Staff</span>
          </Link> */}
          {/* <Link href="#" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12"style={{margin:"0"}} prefetch={false}>
            <RepeatIcon className="w-5 h-5 text-purple-400" />
            <span>Return</span>
          </Link> */}
          
          <Link href="/dashboard/POS" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12"style={{margin:"0"}} prefetch={false}>
            <PinIcon className="w-5 h-5 text-purple-400" />
            <span>POS</span>
          </Link>
          {/* <Link href="#" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12"style={{margin:"0"}} prefetch={false}>
            <CheckIcon className="w-5 h-5 text-purple-400" />
            <span>Report</span>
          </Link> */}
          {/* <Link href="#" className="flex items-center space-x-2 pl-2 hover:bg-[#313131] h-12"style={{margin:"0"}} prefetch={false}>
            <SettingsIcon className="w-5 h-5 text-purple-400" />
            <span>Settings</span>
          </Link> */}
        </nav>
    </div>
  );
}

export default SidebarItems;
