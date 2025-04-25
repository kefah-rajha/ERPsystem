"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// You'll need to create these components or adapt them from your SalesOrder components
import { SupplierInfo } from "@/components/puchaseOrder/supplierInfo";
import { OrderItems } from "@/components/puchaseOrder/orderItems";
import { PurchaseOrderActions } from "@/components/puchaseOrder/PurchaseOrderActions";

// Define the Purchase Order type based on your schema
interface orderProductsType {

  name: string;
  price: number;
  _id: string
}
interface PurchaseOrderItem {
  product: orderProductsType;
  quantity: number;
  unitPrice: string;
  vat: number;
  vatAmount: number;
  totalAmount: number;
}

interface Supplier {
  name: string;
  contactPerson?: string;
  supplierEmail?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

interface PurchaseOrderType {
  _id: string;
  purchaseOrderNumber: string;
  orderDate: string;
  expectedDeliveryDate: string;
  requestedBy: string;
  supplier: Supplier;
  shippingAddress: string;
  items: PurchaseOrderItem[];
  netTotal: number;
  totalVat: number;
  totalAmount: number;
  status: string;
  notes?: string;
  currency: string;
  paymentTerm: string;
}

interface OrdersResponse {
  success: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  currentItemCount: number;
  purchaseOrders: PurchaseOrderType[];
}

interface PurchaseOrderTableProps {
  dateRange: DateRange;
}

export function PurchaseOrderTable({ dateRange }: PurchaseOrderTableProps) {
  const [orders, setOrders] = useState<OrdersResponse>({} as OrdersResponse);
  const [ordersDataResponse, setOrdersDataResponse] = useState<PurchaseOrderType[]>([] as PurchaseOrderType[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();

  const handleDelete = async (id: string) => {
    const fetchDeleteData = await fetch(`/api/deletePurchaseOrder/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      }
    });
    const res = await fetchDeleteData.json();
    if (res.success === true) {
      setOrdersDataResponse(ordersDataResponse?.filter(order => order._id !== id));
      toast.success("Purchase order deleted successfully");
    } else {
      toast.error("Failed to delete purchase order");
    }
  };

  const handleEdit = (id: string) => {
    push(`/dashboard/PurchaseOrder/UpdatePurchaseOrder/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      if (dateRange) {
        const url = new URL('/api/purchaseOrder/getPurchaseOrders', window.location.origin);
        url.searchParams.append('page', currentPage.toString());
        url.searchParams.append('limit', pageSize.toString());

        if (dateRange.from) {
          url.searchParams.append('from', dateRange.from.toString());
        }
        if (dateRange.to) {
          url.searchParams.append('to', dateRange.to.toString());
        }
        
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response, "url");

        if (!response.ok) {
          throw new Error('Failed to fetch purchase orders');
        }

        const data = await response.json();
        console.log(data,"data"
          
        );
        setOrdersDataResponse(data.purchaseOrders);
        setOrders(data);
      }
    } catch (err) {
      console.log('Failed to fetch purchase orders');
      console.error(err);
      setError('Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when page or date range changes
  useEffect(() => {
    fetchPurchaseOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, dateRange, pageSize]);

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "approved":
        return "default";
      case "ordered":
        return "secondary";
      case "received":
        return "default"; // Changed from "success"
      case "pending_approval":
        return "outline"; // Changed from "warning"
      case "cancelled":
        return "destructive";
      case "partially_received":
        return "secondary";
      default:
        return "outline";
    }
  };
  return (
    <div className="rounded-md border ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PO Number</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Expected Delivery</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Term</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Loading purchase orders...
              </TableCell>
            </TableRow>
          ) : ordersDataResponse?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No purchase orders found
              </TableCell>
            </TableRow>
          ) : (
            ordersDataResponse?.map((order: PurchaseOrderType) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order.purchaseOrderNumber}</TableCell>
                <TableCell>
                  <SupplierInfo supplier={order.supplier} />
                </TableCell>
               
                <TableCell>
                <OrderItems items={order.items} /> 
                </TableCell>
                <TableCell>
                  {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {order.currency} {order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{order.paymentTerm}</TableCell>
                <TableCell className="text-right">
                  <PurchaseOrderActions
                    orderId={order._id}
                    orderNumber={order.purchaseOrderNumber}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {orders.totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {orders.currentItemCount} of {orders.totalItems} results
          </div>
        
        </div>
      )}
    </div>
  );
}