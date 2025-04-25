"use client"
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast is used for notifications
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// Assuming you might want a dialog for viewing the PO document - keep for now
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// You might need to adjust the import path for your specific project structure

// Types - Based on your provided schema interfaces
interface PurchaseOrderItem {
  product: { // Assuming product is populated and has a name field
    name: string;
    // ... other product fields you might want to display
  };
  quantity: number;
  unitPrice: number;
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

interface PurchaseOrder {
  purchaseOrderNumber: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  requestedBy?: string;
  supplier: Supplier; // Embedded supplier object
  shippingAddress: string;
  items: PurchaseOrderItem[];
  netTotal: number;
  totalVat: number;
  totalAmount: number;
  status: "draft" | "pending_approval" | "approved" | "ordered" | "partially_received" | "received" | "cancelled";
  notes?: string;
  currency: string;
  paymentTerm: "Net 30" | "Net 60" | "Due on Receipt" | "Cash On Delivery" | string;
}

export default function PurchaseOrderPage() {
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const pathname = usePathname();
  const id = pathname?.split("/").pop(); // Assuming the ID is the last part of the URL

  useEffect(() => {
    // This effect should only run once when the component mounts or id changes
    if (!id) {
      setLoading(false);
      toast.error("Purchase Order ID is missing from the URL.");
      return;
    }

    let ignore = false;
    setLoading(true);

    // Adjust the API endpoint based on your actual route for fetching a single PO
    // Assuming a route like /api/purchaseOrders/:id exists
    fetch(`/api/getPurchaseOrder/${id}`)
      .then((res) => {
        if (!res.ok) {

          // Attempt to read error body if possible
          return res.json().then(err => { throw new Error(err.message || `Failed to fetch purchase order: ${res.status}`); });
        }
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          // Assuming the backend response structure is { purchaseOrder: {...}, success: true, message: "..." }
          console.log(jsonData.purchaseOrder, "purchase order in Showing");
          // Need to ensure dates are correctly parsed if they are strings
          if (jsonData.purchaseOrder) {
             jsonData.purchaseOrder.orderDate = new Date(jsonData.purchaseOrder.orderDate);
             jsonData.purchaseOrder.expectedDeliveryDate = new Date(jsonData.purchaseOrder.expectedDeliveryDate);
          }
          setPurchaseOrder(jsonData.purchaseOrder);
          toast.success("Purchase order loaded successfully");
        }
      })
      .catch((err: Error) => { // Type err as Error for better handling
        console.error("Fetch error:", err); // Log the actual error object
        toast.error(`Failed to load purchase order details: ${err.message || 'Unknown error'}`);
        if (!ignore) {
             setPurchaseOrder(null); // Ensure state is null on error
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    // Cleanup function to prevent state update on unmounted component
    return () => {
      ignore = true;
    };
  }, [id]); // Dependency array includes id

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading Purchase Order...</p>
        </div>
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Purchase order not found</p>
          <p className="mt-2 text-gray-500">The requested purchase order could not be found or might have been deleted.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "pending_approval": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "ordered": return "bg-indigo-100 text-indigo-800";
      case "partially_received": return "bg-orange-100 text-orange-800";
      case "received": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string) => {
     if (!date) return "N/A";
    try {
      return format(new Date(date), "PPP");
    } catch (error) {
       console.error("Error formatting date:", date, error);
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return `${purchaseOrder.currency || 'USD'} 0.00`;
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: purchaseOrder.currency || "USD",
      }).format(amount);
    } catch (error) {
       console.error("Error formatting currency:", amount, error);
       return `${purchaseOrder.currency || 'USD'} ${amount?.toFixed(2) || 'N/A'}`;
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 heighWithOutBar overflow-auto bg-gradient"> {/* Assuming heighWithOutBar and bg-gradient are custom classes */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Purchase Order: {purchaseOrder.purchaseOrderNumber}</h1>
          <p className="text-gray-500">Created on {formatDate(purchaseOrder.orderDate)}</p>
        </div>
        <Badge className={`${getStatusColor(purchaseOrder.status)} mt-2 sm:mt-0 text-sm px-3 py-1 uppercase`}>
          {purchaseOrder.status.replace(/_/g, ' ')} {/* Replace underscores for display */}
        </Badge>
         {/* Dialog for viewing/printing the PO document */}
       
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8"> {/* Adjust grid-cols if needed */}
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Order Items</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger> {/* Changed tab */}
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
                    <dt className="font-medium text-gray-500">PO Number:</dt> {/* Changed label */}
                    <dd>{purchaseOrder.purchaseOrderNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Order Date:</dt>
                    <dd>{formatDate(purchaseOrder.orderDate)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Expected Delivery:</dt> {/* Changed label */}
                    <dd>{formatDate(purchaseOrder.expectedDeliveryDate)}</dd>
                  </div>
                   {purchaseOrder.requestedBy && ( // Conditionally render requestedBy
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Requested By:</dt>
                        <dd>{purchaseOrder.requestedBy}</dd>
                      </div>
                    )}
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Payment Term:</dt>
                    <dd>{purchaseOrder.paymentTerm}</dd>
                  </div>
                   <div className="flex flex-col"> {/* Changed layout for multiline address */}
                      <dt className="font-medium text-gray-500 mb-1">Shipping Address:</dt> {/* Changed label */}
                      <dd className="whitespace-pre-line">{purchaseOrder.shippingAddress}</dd>
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
                    <dd>{formatCurrency(purchaseOrder.netTotal)}</dd>
                  </div>
                   {/* Assuming VAT details are relevant even if includeVat/vatRate aren't top level */}
                  <div className="flex justify-between">
                     {/* You might not have a single vatRate at the PO level, so display item VAT in items tab */}
                    <dt className="font-medium text-gray-500">Total VAT:</dt>
                    <dd>{formatCurrency(purchaseOrder.totalVat)}</dd>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg"> {/* Increased font size for total */}
                    <dt>Total Amount:</dt>
                    <dd>{formatCurrency(purchaseOrder.totalAmount)}</dd>
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
                {purchaseOrder.items.length} items in this purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto"> {/* Add overflow for smaller screens */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                     <TableHead>Unit Price</TableHead> {/* Added column */}
                    <TableHead>VAT (%)</TableHead> {/* Changed label */}
                    <TableHead>VAT Amount</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrder.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product?.name || 'Product Name Not Available'}</TableCell> {/* Handle potentially missing product name */}
                      <TableCell>{item.quantity}</TableCell>
                       <TableCell>{formatCurrency(item.unitPrice)}</TableCell> {/* Display Unit Price */}
                      <TableCell>{item.vat}%</TableCell>
                      <TableCell>{formatCurrency(item.vatAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>

              <div className="mt-6 text-right space-y-2"> {/* Added space-y */}
                <p className="text-gray-500">Net Total: {formatCurrency(purchaseOrder.netTotal)}</p>
                <p className="text-gray-500">Total VAT: {formatCurrency(purchaseOrder.totalVat)}</p>
                <p className="font-bold text-lg">Total: {formatCurrency(purchaseOrder.totalAmount)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplier Information Tab */}
        <TabsContent value="supplier">
           <Card>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle> {/* Changed title */}
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Name:</dt>
                    <dd>{purchaseOrder.supplier.name}</dd>
                  </div>
                   {purchaseOrder.supplier.contactPerson && ( // Conditionally render
                     <div className="flex justify-between">
                       <dt className="font-medium text-gray-500">Contact Person:</dt>
                       <dd>{purchaseOrder.supplier.contactPerson}</dd>
                     </div>
                   )}
                   {purchaseOrder.supplier.supplierEmail && ( // Conditionally render
                     <div className="flex justify-between">
                       <dt className="font-medium text-gray-500">Email:</dt>
                       <dd>{purchaseOrder.supplier.supplierEmail}</dd>
                     </div>
                   )}
                  {purchaseOrder.supplier.phone && ( // Conditionally render
                     <div className="flex justify-between">
                       <dt className="font-medium text-gray-500">Phone:</dt>
                       <dd>{purchaseOrder.supplier.phone}</dd>
                     </div>
                   )}
                   {purchaseOrder.supplier.address && ( // Conditionally render
                     <div className="flex justify-between"> {/* Changed layout for multiline address */}
                       <dt className="font-medium text-gray-500 mb-1">Address:</dt>
                       <dd className="whitespace-pre-line">{purchaseOrder.supplier.address}</dd>
                     </div>
                   )}
                   {purchaseOrder.supplier.taxId && ( // Conditionally render
                     <div className="flex justify-between">
                       <dt className="font-medium text-gray-500">Tax ID:</dt>
                       <dd>{purchaseOrder.supplier.taxId}</dd>
                     </div>
                   )}
                </dl>
              </CardContent>
            </Card>
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
                  {purchaseOrder.notes ? (
                    <p className="whitespace-pre-line">{purchaseOrder.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">No notes available for this purchase order.</p> 
                  )}
                </div>
              </div>

               {/* Simplified Timeline for Purchase Orders */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Timeline</h3>
                <div className="relative pl-6 border-l border-gray-200 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-9 w-4 h-4 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-gray-500">{formatDate(purchaseOrder.orderDate)}</p>
                    <p className="font-medium">Purchase Order Created</p> {/* Changed label */}
                  </div>

                  <div className="relative">
                    <div className={`absolute -left-9 w-4 h-4 rounded-full ${
                       ['partially_received', 'received', 'cancelled'].includes(purchaseOrder.status) ? 'bg-gray-300' : 'bg-blue-500' // Color based on whether expected delivery might still happen
                    }`}></div>
                    <p className="text-sm text-gray-500">{formatDate(purchaseOrder.expectedDeliveryDate)}</p>
                    <p className="font-medium">Expected Delivery Date</p> {/* Changed label */}
                  </div>

                   {purchaseOrder.status === 'received' && ( // Show received step if status is received
                       <div className="relative">
                           <div className="absolute -left-9 w-4 h-4 rounded-full bg-green-500"></div>
                            <p className="text-sm text-gray-500">Date Received (Not in Schema)</p> {/* Indicate date is not in schema */}
                           <p className="font-medium">Order Received</p>
                       </div>
                   )}
                    {purchaseOrder.status === 'cancelled' && ( // Show cancelled step if status is cancelled
                       <div className="relative">
                           <div className="absolute -left-9 w-4 h-4 rounded-full bg-red-500"></div>
                            <p className="text-sm text-gray-500">Date Cancelled (Not in Schema)</p> {/* Indicate date is not in schema */}
                           <p className="font-medium">Order Cancelled</p>
                       </div>
                   )}
                </div>
              </div>

               {/* Display Current Status Explicitly */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Current Status</h3>
                     <Badge className={`${getStatusColor(purchaseOrder.status)} text-sm px-3 py-1 uppercase`}>
                        {purchaseOrder.status.replace(/_/g, ' ')}
                    </Badge>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}