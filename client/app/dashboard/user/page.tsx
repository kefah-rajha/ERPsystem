"use client"

import TableUser from "@/components/user/tableUser"
import CreateUserButton from "@/components/user/Button/CreateUserButton"
import ImportUsers from "@/components/user/Button/ImportUsers"
import UserFilter from "@/components/user/Button/userFilter"
import { UserProvider } from "@/context/userContext"
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls";
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";




function Page() {
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


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
    <div className='  heighWithOutBar overflow-auto pt-4 container'>
      <UserProvider>
        <div className='h-14 flex items-center overflow-auto container justify-end gap-2'>
          <UserFilter pageNumber={currentPage} pageSize={pageSize} />
          <CreateUserButton />
          <ImportUsers />
        </div>
        <TableUser />

        <Card className="sticky bottom-0  ">
          <CardContent className="pt-6 pb-6 px-6">

            <PaginationControls
              numberProducts={numberProducts}
              countPages={countPages}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />

          </CardContent>
        </Card>

      </UserProvider>
    </div>
  )
}

export default Page


