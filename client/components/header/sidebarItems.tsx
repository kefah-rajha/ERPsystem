"use client";
import React from "react";
import { AppWindowMac } from "lucide-react";
import Link from "next/link";
function SidebarItems() {
  return (
    <div className="pt-6">
      <Link
        href="/POS"
        className="flex space-x-1 h-12 pl-4 w-full items-center bg-[#313131] "
      >
        <AppWindowMac
          height={16}
          width={16}
          color="#D4B2E9"
          className=" mr-2"
        />

        <p className="text-xl font-semibold ">POS</p>
      </Link>
    </div>
  );
}

export default SidebarItems;
