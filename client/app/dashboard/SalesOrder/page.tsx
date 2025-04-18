"use client";

import { useState } from "react";
import { DateRangePicker } from "@/components/SalesOrder/showAllSalesOrder/date-range-picker";
import { SalesOrderTable } from "@/components/SalesOrder/showAllSalesOrder/sales-order-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import CollapsibleCard from "@/components/SalesOrder/showAllSalesOrder/CollapsibleCard";

import { DateRange } from "react-day-picker";
import { Boxes } from "lucide-react";
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls";
import { cn } from "@/lib/utils";

export default function SalesOrderPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const router=useRouter()
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  console.log(dateRange, "dateRange")
  return (
    <div className="container mx-auto py-8 heighWithOutBar bg-gradient overflow-auto">
<div className="w-full flex justify-end">
  <Button className='h-10 rounded-sm   text-foreground card-gradient  hover:text-gray-400 mb-2 ' onClick={() => router.push('/dashboard/SalesOrder/createSaleOrder')}>
        <Boxes className='h-4 w-4 mr-2 text-green-300 ' />
        Create Sales Order</Button>
        </div>
      <Toaster />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sales Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
          <SalesOrderTable dateRange={dateRange} />
        </CardContent>
      </Card>
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
    </div>
  );
}