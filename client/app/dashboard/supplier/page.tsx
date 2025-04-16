"use client"

import SuppliersTable from "@/components/supplier/suppliersTable"
import SupplierFilter from "@/components/supplier/button/supplierFilter"
import { SupplierProvider } from "@/context/supplierContext"
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls";
import CollapsibleCard from "@/components/SalesOrder/showAllSalesOrder/CollapsibleCard";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { UserPlus } from "lucide-react"




function Page() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [countPages, setCountPages] = useState<number>(1); // Total number of pages
  const [currentPage, setCurrentPage] = useState(1); // Current active page
  const [pageSize, setPageSize] = useState(10); // Number of items per page
  const [numberProducts, setNumberProducts] = useState<number>(0); // Total count of products
  const {  push } = useRouter();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);


    // Show loading toast for better UX
    toast.loading('Loading products...', { id: 'pageChange' });

    // This will be cancelled by the useEffect in ProductFilter component
    setTimeout(() => {
      toast.dismiss('pageChange');
    }, 2000);
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size


    toast.success(`Showing ${size} items per page`);
  };

  return (
    <div className='  heighWithOutBar pt-4 container bg-gradient overflow-auto'>
      <SupplierProvider>
        <div className='h-14 flex items-center container justify-end gap-2'>
          {/* <CreateSupplierButton /> */}
          <Button
            className='h-10 rounded-sm text-foreground card-gradient hover:text-gray-400'
            onClick={() => {
              toast.loading('Loading create form...', { id: 'createProduct' });
              push('/dashboard/supplier/createSupplier');
            }}
          >                        <UserPlus className='h-4 w-4 mr-2 text-green-300 ' />
            Create Supplier</Button>
          <SupplierFilter />

          {/* <ImportUsers/> */}



        </div>
        <SuppliersTable />

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
      </SupplierProvider>
    </div>
  )
}

export default Page


