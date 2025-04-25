"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerInfo } from "@/components/SalesOrder/showAllSalesOrder/customer-info";
import { OrderItems } from "@/components/SalesOrder/showAllSalesOrder/order-items";
import { SalesOrderActions } from "@/components/SalesOrder/showAllSalesOrder/sales-order-actions";
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SalesOrderType } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder"
import { useRouter } from "next/navigation";
interface SalesOrderTableProps {
  dateRange: DateRange;
}


interface ordersType {
  ordersCount: number;
  page: number;
  salesOrders: SalesOrderType[];
  totalOrders: number;
  totalPages: number;
}

export function SalesOrderTable({ dateRange }: SalesOrderTableProps) {
  const [orders, setOrders] = useState<ordersType>({} as ordersType);
  const [ordersDataResponse, setOrdersDataResponse] = useState<SalesOrderType[]>([] as SalesOrderType[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter()
  const handleDelete = async (id: string) => {
    const fetchDeleteData = await fetch(`/api/deleteSalesOrder/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      }
    })
    const res = await fetchDeleteData.json()
    if (res.success == true) {

      setOrdersDataResponse(ordersDataResponse?.filter(order => order._id !== id));
      toast.success("Sales order deleted successfully");

    } else {
      toast.success("Oh!!! delete sale order is faild");

    }


  };

  const handleEdit = (id: string) => {
    push(`/dashboard/SalesOrder/UpdateSaleOrder/${id}`)
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // const paginatedOrders = orders?.salesOrders

  const fetchSalesOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      if (dateRange) {
        const url = new URL('/api/getSalesOrders', window.location.origin);
        url.searchParams.append('page', currentPage.toString());
        url.searchParams.append('limit', pageSize.toString());

        url.searchParams.append('from', dateRange?.from.toString());
        url.searchParams.append('to', dateRange?.to.toString());
        console.log(url, "url")
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sales orders');
        }

        const data = await response.json();
        console.log(data)
        setOrdersDataResponse(data.salesOrders)
        setOrders(data)

      }
    } catch (err) {
      console.log('Failed to fetch sales orders');
      console.error(err);
    } finally {
      // setLoading(false);
    }
  };

  // Fetch orders when page or date range changes
  useEffect(() => {
    fetchSalesOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, dateRange, pageSize]);


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Term</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersDataResponse?.map((order: SalesOrderType) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <CustomerInfo customer={order.customer} />
              </TableCell>
              <TableCell>{order?.supplier?.name}</TableCell>
              <TableCell>
                <OrderItems items={order.items} />
              </TableCell>
              <TableCell className="text-right">
                ${order.totalAmount}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "completed"
                      ? "default"
                      : order.status === "processed"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.paymentTerm}</TableCell>
              <TableCell className="text-right">
                <SalesOrderActions
                  orderId={order._id}
                  orderNumber={order.orderNumber}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </div>
  );
}