"use client";

import { useState } from "react";
import { DateRangePicker } from "@/components/SalesOrder/showAllSalesOrder/date-range-picker";
import { SalesOrderTable } from "@/components/SalesOrder/showAllSalesOrder/sales-order-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { DateRange } from "react-day-picker";

export default function SalesOrderPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
 
console.log(dateRange ,"dateRange")
  return (
    <div className="container mx-auto py-8 heighWithOutBar overflow-auto">
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