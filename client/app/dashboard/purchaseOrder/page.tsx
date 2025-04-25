// app/dashboard/PurchaseOrder/PurchaseOrderPage.tsx (or wherever your route is)
"use client";

import { useState } from "react";
import { DateRangePicker } from "@/components/SalesOrder/showAllSalesOrder/date-range-picker"; // Assuming this component is reusable
// Import the new or adapted table component for Purchase Orders
import { PurchaseOrderTable } from "@/components/puchaseOrder/PurchaseOrderTable"; // Adjust path and component name
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Reusable
import { Toaster } from "@/components/ui/sonner"; // Reusable
import { Button } from "@/components/ui/button"; // Reusable
import { useRouter } from 'next/navigation'; // Reusable
import CollapsibleCard from "@/components/SalesOrder/showAllSalesOrder/CollapsibleCard"; // Assuming this component is reusable

import { DateRange } from "react-day-picker"; // Reusable type
import { Boxes } from "lucide-react"; // Reusable icon
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls"; // Assuming this component is reusable
import { cn } from "@/lib/utils"; // Reusable utility

// Rename the component
export default function PurchaseOrderPage() {
  // State variables remain similar, adjusted names for clarity
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default: last month to now
    to: new Date(),
  });
  // Renamed to reflect total count of purchase orders
  const [totalPurchaseOrders, setTotalPurchaseOrders] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);

  const router = useRouter();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // console.log(dateRange, "dateRange"); // Keep for debugging if needed

  return (
    // Consider renaming the class if "SalesOrder" is specific
    <div className="container mx-auto py-8 heighWithOutBar bg-gradient overflow-auto">
      <div className="w-full flex justify-end">
        {/* Update button text and link */}
        <Button
          className='h-10 rounded-sm text-foreground card-gradient hover:text-gray-400 mb-2'
          onClick={() => router.push('/dashboard/PurchaseOrder/createPurchaseOrder')} // Adjust route
        >
          <Boxes className='h-4 w-4 mr-2 text-green-300' /> {/* Icon is reusable */}
          Create Purchase Order {/* Updated text */}
        </Button>
      </div>
      <Toaster /> {/* Reusable */}

      <Card>
        <CardHeader>
          {/* Update Card Title */}
          <CardTitle className="text-2xl font-bold">Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            {/* DateRangePicker is reusable */}
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
        
          <PurchaseOrderTable
            dateRange={dateRange}
          
          />
        </CardContent>
      </Card>

      <Card className={cn(!isExpanded ? "sticky bottom-0 w-fit" : "sticky bottom-0 w-full")} >
        <CardContent className="pt-6 pb-6 px-6">
          <CollapsibleCard
            numberProducts={totalPurchaseOrders} // Use the updated state name
            currentPage={currentPage}
            countPages={countPages}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          >
            <PaginationControls
              numberProducts={totalPurchaseOrders} // Use the updated state name
              countPages={countPages}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            // disabled={loading} // Pass loading state from table component if available
            />
          </CollapsibleCard>
        </CardContent>
      </Card>
    </div>
  );
}