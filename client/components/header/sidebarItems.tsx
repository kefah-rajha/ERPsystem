"use client";
import React, { useEffect, useState } from "react";
import {
  AppWindowMac,
  Asterisk,
  CheckIcon,
  ChevronDown,
  ChevronUp,
  Container,
  Hash,
  LayoutDashboardIcon,
  PinIcon,
  RepeatIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StoreIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { url } from "inspector";
import { motion } from "framer-motion";
function SidebarItems() {
  const [isActive, setIsActive] = useState<string>("");
  const [isActiveProduct, setIsActiveProduct] = useState<string>("Products");
  const Url = usePathname();
  useEffect(() => {
    if (Url.includes("dashboard")) {
      setIsActive("dashboard");
    }
    if (Url.includes("user")) {
      setIsActive("user");
    }
    if (Url.includes("POS")) {
      setIsActive("POS");
    }
    if (Url.includes("Products")) {
      setIsActive("Products");
    }
    if (Url.includes("Products")) {
      setIsActiveProduct("Products");
    }
    if (Url.includes("createProduct")) {
      setIsActiveProduct("createProducts");
    }


  }, [Url]);

  return (
    <div className="pt-6">
      <nav className="space-y-4 overflow-auto h-full">
        <Link
          href="/dashboard"
          className={cn(
            isActive == "dashboard" ? "card-gradient" : " hover:bg-[#313131]  ",
            " h-12 flex m-0 items-center space-x-2 pl-2"
          )}
          onClick={() => setIsActive("dashboard")}
          style={{ margin: "0" }}
          prefetch={false}
        >
          <LayoutDashboardIcon className="w-5 h-5 text-purple-400" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/dashboard/user"
          className={cn(
            isActive == "user" ? "card-gradient" : " hover:bg-[#313131]  ",
            " h-12 flex m-0 items-center space-x-2 pl-2"
          )}
          onClick={() => setIsActive("user")}
          style={{ margin: "0" }}
          prefetch={false}
        >
          <UserIcon className="w-5 h-5 text-purple-400" />
          <span>User</span>
        </Link>
        <Link
          href="/dashboard/Products"
          className={cn(
            isActive == "Products" ? "card-gradient" : " hover:bg-[#313131]  ",
            " h-12 flex m-0 items-center space-x-2 pl-2"
          )}
          onClick={() => setIsActive("Products")}
          style={{ margin: "0" }}
          prefetch={false}
        >
          <Container className="w-4 h-4 text-purple-400" />
          <span className="w-8/12">Products</span>
          <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ rotate: 180 }}
      animate={{ rotate: isActive == "Products" ? 0 : 180 }}
      transition={{ duration: 0.5 }}
    >
      
      
            <ChevronDown className={cn(isActive =="Products" ?"text-orange-500 hover:text-foreground/40": "text-foreground/40 hover:text-orange-500"," h-6 w-6 transition-colors ")} />
        
      </motion.svg>
     

        </Link>

        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isActive =="Products" ? 1 : 0, y: 0 }}
        transition={{ duration: 1 }}
        style={{ margin: 0 }}
      >
        <div
          style={{ margin: 0 }}
          className={cn(
            "inputCustom transition duration-700 ease-in-out",
            isActive == "Products" ? "block" : "hidden"
          )}
        >
          <Link
            href="/dashboard/Products"
            className={cn(
              isActiveProduct == "Products"
                ? "bg-[#313131]/40"
                : " hover:bg-[#313131]  ",
              "  h-12 flex m-0 items-center space-x-2 pl-2"
            )}
            onClick={() => setIsActiveProduct("Products")}
            style={{ margin: "0" }}
            prefetch={false}
          >
            <Asterisk
              className={cn(
                isActiveProduct == "Products"
                  ? "text-orange-500"
                  : " hover:bg-[#313131]  ",
                " text-sm h-3 w-3 ml-[10%]"
              )}
            />

            <span className="font-light text-sm">Products</span>
          </Link>
          <Link
            href="/dashboard/Products/createProduct"
            className={cn(
              isActiveProduct == "createProducts"
              ? "bg-[#313131]/40"
              : " hover:bg-[#313131]  ",
            "  h-12 flex m-0 items-center space-x-2 pl-2"
            )}
            onClick={() => setIsActiveProduct("createProducts")}
            style={{ margin: "0" }}
            prefetch={false}
          >
            <Asterisk
              className={cn(
                isActiveProduct == "createProducts"
                  ? "text-orange-500"
                  : " hover:bg-[#313131]  ",
                " text-sm h-3 w-3 ml-[10%]"
              )}
            />

            <span className="font-light text-sm"> Create Products</span>
          </Link>
          <Link
            href="/dashboard/Products"
            className={cn(
              isActive == "CreateProducts"
                ? "bg-[#313131] "
                : " hover:bg-[#313131]   ",
              "  h-12 flex m-0 items-center space-x-2 pl-2 text-foreground/50"
            )}
            onClick={() => setIsActive("CreateProducts")}
            style={{ margin: "0" }}
            prefetch={false}
          >
            <Asterisk
              className={cn(
                isActive == "CreateProducts"
                  ? "text-orange-500"
                  : " hover:bg-[#313131]  ",
                " text-sm h-3 w-3 ml-[10%]"
              )}
            />

            <span className="font-light text-sm"> Categories</span>
          </Link>
        </div>
        </motion.div>
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

        <Link
          href="/dashboard/POS"
          className={cn(
            isActive == "POS" ? "card-gradient" : " hover:bg-[#313131]  ",
            " h-12 flex m-0 items-center space-x-2 pl-2"
          )}
          onClick={() => setIsActive("POS")}
          style={{ margin: "0" }}
          prefetch={false}
        >
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
