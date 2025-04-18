"use client"
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import Invoice from "@/components/POS/invoice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// Types
interface OrderItem {
  product: any; // Using any for now since we're fetching from API
  quantity: number;
  vat: number;
  vatAmount: number;
  totalAmount: number;
}

interface Customer {
 userName: string;
  shipmentAddress: string;
  phone: string;
  customerEmail: string;
}

interface SalesStaff {
  name: string;
  code: string;
}

interface SalesOrder {
  orderNumber: string;
  orderDate: Date;
  shipmentDate: Date;
  salesManager: string;
  customer: Customer;
  supplier: SalesStaff;
  items: OrderItem[];
  netTotal: number;
  totalVat: number;
  totalAmount: number;
  status: 'pending' | 'processed' | 'completed' | 'cancelled';
  notes?: string;
  vatRate: number;
  includeVat: boolean;
  currency: string;
  paymentTerm: "Cash" | "Card" | "Bank Transfers" | "Checks" | "Electronic Payments" | "Deferred Payments";
}

export default function SalesOrderPage() {
  const [saleOrder, setSaleOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    
    fetch(`/api/getSaleOrder/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch sales order");
        }
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData.posts, "sale order in Showing");
          setSaleOrder(jsonData.posts);
          toast.success("Sales order loaded successfully");
        }
      })
      .catch((err: unknown) => {
        console.log(err);
        toast.error("Failed to load sales order details");
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
      
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading Sales Order...</p>
        </div>
      </div>
    );
  }

  if (!saleOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Sales order not found</p>
          <p className="mt-2 text-gray-500">The requested sales order could not be found or might have been deleted.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processed": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "PPP");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: saleOrder.currency || "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4 heighWithOutBar overflow-auto bg-gradient">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Order: {saleOrder.orderNumber}</h1>
          <p className="text-gray-500">Created on {formatDate(saleOrder.orderDate)}</p>
        </div>
        <Badge className={`${getStatusColor(saleOrder.status)} mt-2 sm:mt-0 text-sm px-3 py-1 uppercase`}>
          {saleOrder.status}
        </Badge>
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="card-gradient">Generate Invoice</Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
       
        </DialogHeader>
        <Invoice salesOrder={saleOrder} />

        </DialogContent>
        </Dialog>

      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Order Items</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="notes">Notes & Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Order Number:</dt>
                    <dd>{saleOrder.orderNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Order Date:</dt>
                    <dd>{formatDate(saleOrder.orderDate)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Shipment Date:</dt>
                    <dd>{formatDate(saleOrder.shipmentDate)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Sales Manager:</dt>
                    <dd>{saleOrder.salesManager}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Payment Term:</dt>
                    <dd>{saleOrder.paymentTerm}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Net Total:</dt>
                    <dd>{formatCurrency(saleOrder.netTotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">VAT Rate:</dt>
                    <dd>{saleOrder.vatRate}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">VAT Included:</dt>
                    <dd>{saleOrder.includeVat ? "Yes" : "No"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Total VAT:</dt>
                    <dd>{formatCurrency(saleOrder.totalVat)}</dd>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <dt>Total Amount:</dt>
                    <dd>{formatCurrency(saleOrder.totalAmount)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                {saleOrder.items.length} items in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>VAT</TableHead>
                    <TableHead>VAT Amount</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleOrder.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name || 'Product Name Not Available'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.vat}%</TableCell>
                      <TableCell>{formatCurrency(item.vatAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 text-right">
                <p className="text-gray-500">Net Total: {formatCurrency(saleOrder.netTotal)}</p>
                <p className="text-gray-500">Total VAT: {formatCurrency(saleOrder.totalVat)}</p>
                <p className="font-bold text-lg">Total: {formatCurrency(saleOrder.totalAmount)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">userName:</dt>
                    <dd>{saleOrder.customer.userName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Email:</dt>
                    <dd>{saleOrder.customer.customerEmail}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Phone:</dt>
                    <dd>{saleOrder.customer.phone}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="font-medium text-gray-500 mb-1">Shipment Address:</dt>
                    <dd className="whitespace-pre-line">{saleOrder.customer.shipmentAddress}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Name:</dt>
                    <dd>{saleOrder.supplier.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Code:</dt>
                    <dd>{saleOrder.supplier.code}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Order Notes & Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {saleOrder.notes ? (
                    <p className="whitespace-pre-line">{saleOrder.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">No notes available for this order.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Order Timeline</h3>
                <div className="relative pl-6 border-l border-gray-200 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-9 w-4 h-4 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-gray-500">{formatDate(saleOrder.orderDate)}</p>
                    <p className="font-medium">Order Created</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-9 w-4 h-4 rounded-full ${
                      saleOrder.status === 'pending' ? 'bg-gray-300' : 'bg-blue-500'
                    }`}></div>
                    <p className="text-sm text-gray-500">{
                      saleOrder.status === 'pending' ? 'Pending' : formatDate(saleOrder.shipmentDate)
                    }</p>
                    <p className="font-medium">Order Processed</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-9 w-4 h-4 rounded-full ${
                      saleOrder.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <p className="text-sm text-gray-500">{
                      saleOrder.status === 'completed' ? formatDate(saleOrder.shipmentDate) : 'Pending'
                    }</p>
                    <p className="font-medium">Order Completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}