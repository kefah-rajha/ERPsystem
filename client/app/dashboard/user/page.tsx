"use client"

import TableUser from "@/components/user/tableUser"
import ImportUsers from "@/components/user/Button/ImportUsers"
import UserFilter from "@/components/user/Button/userFilter"
import { UserProvider } from "@/context/userContext"
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls";
import { useEffect, useState } from "react"
import { Button } from '@/components/ui/button'
import { Router, UserPlus } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CollapsibleCard from "@/components/SalesOrder/showAllSalesOrder/CollapsibleCard";
import { cn } from "@/lib/utils"



function Page() {
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
const router =useRouter()

  useEffect(() => {
    const getNumberProducts = async () => {

      const getNumberProductsServer = await fetch("/api/users/getNumberUsers", {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },


      })
      const resNumberProduct = await getNumberProductsServer.json()
      console.log(resNumberProduct, "resproduct");
      if (resNumberProduct?.data) {
        setNumberProducts(resNumberProduct.data);
        console.log(resNumberProduct, "resNumberProduct.count")
        const totalPages = Math.ceil(resNumberProduct.data / pageSize);
        console.log(totalPages, pageSize, "totalPages1111");
        setCountPages(totalPages);

      }
    };
    getNumberProducts();
  }, [pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  return (
    <div className='  heighWithOutBar overflow-auto pt-4 bg-gradient container'>
      <UserProvider>
        <div className='h-14 flex items-center overflow-auto container justify-end gap-2'>
          <UserFilter pageNumber={currentPage} pageSize={pageSize} />
          <Button className='h-10 rounded-sm   text-foreground card-gradient  hover:text-gray-400 '
          onClick={()=>router.push("/dashboard/user/createUser")}
          >
            <UserPlus className='h-4 w-4 mr-2 text-green-300 ' />
            Create User</Button>
          <ImportUsers />
        </div>
        <TableUser />

        <Card className={cn(!isExpanded ? "sticky bottom-0 w-fit" : "sticky bottom-0 w-full")} >
          <CardContent className="pt-6 pb-6 px-6">
            <CollapsibleCard
              numberProducts={numberProducts}
              currentPage={currentPage}
              countPages={countPages}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}

            >
              <PaginationControls
                numberProducts={numberProducts}
                countPages={countPages}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              // disabled={loading}
              />
            </CollapsibleCard>
          </CardContent>
        </Card>
      </UserProvider>
    </div>
  )
}

export default Page


