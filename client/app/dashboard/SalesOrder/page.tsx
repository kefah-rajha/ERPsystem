"use client";

import { useState } from "react";
import { DateRangePicker } from "@/components/SalesOrder/showAllSalesOrder/date-range-picker";
import { SalesOrderTable } from "@/components/SalesOrder/showAllSalesOrder/sales-order-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

import { DateRange } from "react-day-picker";
import { Boxes } from "lucide-react";

export default function SalesOrderPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const router=useRouter()

  console.log(dateRange, "dateRange")
  return (
    <div className="container mx-auto py-8 heighWithOutBar overflow-auto">
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
    </div>
  );
}