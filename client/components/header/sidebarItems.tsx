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
    const [isActiveSaleOrder, setIsActiveSaleOrder] = useState<string>("SalesOrder");

  const Url = usePathname();
  console.log(Url)
  useEffect(() => {
    if (Url.includes("dashboard")) {
      setIsActive("dashboard");
    }
    if (Url.includes("user")) {
      setIsActive("user");
    }
    if (Url.includes("supplier")) {
      setIsActive("supplier");
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

    if (Url.includes("SalesOrder")) {
      setIsActive("SalesOrder");

    }
    if (Url.includes("createSalesOrder")) {
      setIsActiveSaleOrder("createSalesOrder");
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
          href="/dashboard/supplier"
          className={cn(
            isActive == "supplier" ? "card-gradient" : " hover:bg-[#313131]  ",
            " h-12 flex m-0 items-center space-x-2 pl-2"
          )}
          onClick={() => setIsActive("Supplier")}
          style={{ margin: "0" }}
          prefetch={false}
        >
          <Asterisk className="w-5 h-5 text-purple-400" />
          <span>Supplier</span>
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


            <ChevronDown className={cn(isActive == "Products" ? "text-orange-500 hover:text-foreground/40" : "text-foreground/40 hover:text-orange-500", " h-6 w-6 transition-colors ")} />

          </motion.svg>


        </Link>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isActive == "Products" ? 1 : 0, y: 0 }}
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
        <Link
          href="/dashboard/SalesOrder"
          className={cn(
            isActive == "SalesOrder" ? "card-gradient" : " hover:bg-[#313131]  ",
            " h-12 flex m-0 items-center space-x-2 pl-2"
          )}
          onClick={() => setIsActive("SalesOrder")}
          style={{ margin: "0" }}
          prefetch={false}
        >
          <Container className="w-4 h-4 text-purple-400" />
          <span className="w-8/12">Sales Order</span>
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
            animate={{ rotate: isActive == "SalesOrder" ? 0 : 180 }}
            transition={{ duration: 0.5 }}
          >


            <ChevronDown className={cn(isActive == "SalesOrder" ? "text-orange-500 hover:text-foreground/40" : "text-foreground/40 hover:text-orange-500", " h-6 w-6 transition-colors ")} />

          </motion.svg>


        </Link>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isActive == "SalesOrder" ? 1 : 0, y: 0 }}
          transition={{ duration: 1 }}
          style={{ margin: 0 }}
        >
          <div
            style={{ margin: 0 }}
            className={cn(
              "inputCustom transition duration-700 ease-in-out",
              isActive == "SalesOrder" ? "block" : "hidden"
            )}
          >
            <Link
              href="/dashboard/SalesOrder"
              className={cn(
                isActiveSaleOrder == "SalesOrder"
                  ? "bg-[#313131]/40"
                  : " hover:bg-[#313131]  ",
                "  h-12 flex m-0 items-center space-x-2 pl-2"
              )}
              onClick={() => setIsActiveSaleOrder("SalesOrder")}
              style={{ margin: "0" }}
              prefetch={false}
            >
              <Asterisk
                className={cn(
                  isActiveSaleOrder == "SalesOrder"
                    ? "text-orange-500"
                    : " hover:bg-[#313131]  ",
                  " text-sm h-3 w-3 ml-[10%]"
                )}
              />

              <span className="font-light text-sm">SalesOrder</span>
            </Link>
            <Link
              href="/dashboard/SalesOrder/createSaleOrder"
              className={cn(
                isActiveSaleOrder== "createSalesOrder"
                  ? "bg-[#313131]/40"
                  : " hover:bg-[#313131]  ",
                "  h-12 flex m-0 items-center space-x-2 pl-2"
              )}
              onClick={() => setIsActiveSaleOrder("createSalesOrder")}
              style={{ margin: "0" }}
              prefetch={false}
            >
              <Asterisk
                className={cn(
                  isActiveSaleOrder == "createSalesOrder"
                    ? "text-orange-500"
                    : " hover:bg-[#313131]  ",
                  " text-sm h-3 w-3 ml-[10%]"
                )}
              />

              <span className="font-light text-sm">  Create SalesOrder</span>
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


// import React from 'react';
// import { usePathname, useSearchParams ,useRouter} from 'next/navigation'
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';

// import {
//   LayoutDashboard,
//   Users,
//   Truck,
//   Package,
//   ShoppingCart,
//   ClipboardList,
//   ChevronDown,
//   Menu,
// } from 'lucide-react';

// interface NavItem {
//   title: string;
//   icon: React.ReactNode;
//   path?: string;
//   submenu?: { title: string; path: string }[];
// }

// const navItems: NavItem[] = [
//   {
//     title: 'Dashboard',
//     icon: <LayoutDashboard className="h-4 w-4" />,
//     path: '/dashboard',
//   },
//   {
//     title: 'Users',
//     icon: <Users className="h-4 w-4" />,
//     path: '/users',
//   },
//   {
//     title: 'Suppliers',
//     icon: <Truck className="h-4 w-4" />,
//     path: '/suppliers',
//   },
//   {
//     title: 'Products',
//     icon: <Package className="h-4 w-4" />,
//     submenu: [
//       { title: 'Products List', path: '/products' },
//       { title: 'Create Product', path: '/products/create' },
//       { title: 'Categories', path: '/products/categories' },
//     ],
//   },
//   {
//     title: 'POS',
//     icon: <ShoppingCart className="h-4 w-4" />,
//     path: '/pos',
//   },
//   {
//     title: 'Sales Order',
//     icon: <ClipboardList className="h-4 w-4" />,
//     path: '/sales',
//   },
// ];

// export function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = React.useState(false);
//   const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);
//   const location = usePathname();;
//   const navigate = useRouter();

//   const isActive = (path: string) => location === path;
//   const hasActiveSubmenu = (item: NavItem) =>
//     item.submenu?.some((subitem) => isActive(subitem.path));

//   return (
//     <div
//       className={cn(
//         'flex flex-col border-r bg-gray-100/40 h-screen',
//         isCollapsed ? 'w-16' : 'w-64'
//       )}
//     >
//       <div className="flex h-14 items-center border-b px-4">
//         {!isCollapsed && (
//           <span className="font-semibold">Admin Dashboard</span>
//         )}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="ml-auto"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//         >
//           <Menu className="h-4 w-4" />
//         </Button>
//       </div>
//       <nav className="flex-1 space-y-1 p-2">
//         {navItems.map((item) => (
//           <div key={item.title}>
//             <Button
//               variant={
//                 isActive(item.path ?? '') || hasActiveSubmenu(item)
//                   ? 'secondary'
//                   : 'ghost'
//               }
//               className={cn(
//                 'w-full justify-start gap-2',
//                 isCollapsed && 'justify-center'
//               )}
//               onClick={() => {
//                 if (item.submenu) {
//                   setOpenSubmenu(
//                     openSubmenu === item.title ? null : item.title
//                   );
//                 } else if (item.path) {
//                   navigate.push(item.path);
//                 }
//               }}
//             >
//               {item.icon}
//               {!isCollapsed && (
//                 <>
//                   <span className="flex-1 text-left">{item.title}</span>
//                   {item.submenu && (
//                     <ChevronDown
//                       className={cn(
//                         'h-4 w-4 transition-transform',
//                         openSubmenu === item.title && 'rotate-180'
//                       )}
//                     />
//                   )}
//                 </>
//               )}
//             </Button>
//             {!isCollapsed && item.submenu && openSubmenu === item.title && (
//               <div className="ml-4 mt-1 space-y-1">
//                 {item.submenu.map((subitem) => (
//                   <Button
//                     key={subitem.path}
//                     variant={isActive(subitem.path) ? 'secondary' : 'ghost'}
//                     className="w-full justify-start"
//                     onClick={() => navigate.push(subitem.path)}
//                   >
//                     {subitem.title}
//                   </Button>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>
//     </div>
//   );
// }