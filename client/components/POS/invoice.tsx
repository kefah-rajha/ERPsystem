// "use client"
// import { useState } from 'react'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { PrinterIcon, DownloadIcon, ArrowLeftIcon } from 'lucide-react'
// import { format } from 'date-fns'

// // Mock function for PDF generation - you would replace this with actual PDF library
// import  jsPDF  from 'jspdf'
// import 'jspdf-autotable'
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: (options: any) => jsPDF;
//     lastAutoTable: {
//       finalY: number;
//     };
//   }
// }

// interface OrderItem {
//   product: any; // Using any for now since we're fetching from API
//   quantity: number;
//   vat: number;
//   vatAmount: number;
//   totalAmount: number;
// }

// interface Customer {
//  userName: string;
//   shipmentAddress: string;
//   phone: string;
//   customerEmail: string;
// }

// interface SalesStaff {
//   name: string;
//   code: string;
// }

// interface SalesOrder {
//   orderNumber: string;
//   orderDate: Date;
//   shipmentDate: Date;
//   salesManager: string;
//   customer: Customer;
//   supplier: SalesStaff;
//   items: OrderItem[];
//   netTotal: number;
//   totalVat: number;
//   totalAmount: number;
//   status: 'pending' | 'processed' | 'completed' | 'cancelled';
//   notes?: string;
//   vatRate: number;
//   includeVat: boolean;
//   currency: string;
//   paymentTerm: "Cash" | "Card" | "Bank Transfers" | "Checks" | "Electronic Payments" | "Deferred Payments";
// }


// interface InvoiceType{
//   salesOrder:SalesOrder
// }
// export default function Invoice({ salesOrder }:InvoiceType) {
//   const [isPrinting, setIsPrinting] = useState(false)
//   const [isExporting, setIsExporting] = useState(false)

//   // If no sales order is provided, return empty state
//   if (!salesOrder) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p>No invoice data available</p>
//       </div>
//     )
//   }

//   const handlePrint = () => {
//     setIsPrinting(true)
//     window.print()
//     setTimeout(() => setIsPrinting(false), 500)
//   }

//   const handleDownloadPDF = () => {
//     console.log("test")
//     setIsExporting(true)
    
//     try {
//       const doc = new jsPDF()
      
//       // Add company logo/header
//       doc.setFontSize(20)
//       doc.text('INVOICE', 105, 20, { align: 'center' })
      
//       // Add invoice details
//       doc.setFontSize(12)
//       doc.text(`Invoice Number: ${salesOrder.orderNumber}`, 15, 40)
//       doc.text(`Date: ${format(new Date(salesOrder.orderDate), 'dd/MM/yyyy')}`, 15, 47)
//       doc.text(`Shipment Date: ${format(new Date(salesOrder.shipmentDate), 'dd/MM/yyyy')}`, 15, 54)
      
//       // Add customer details
//       doc.text('Bill To:', 15, 70)
//       doc.text(salesOrder.customer.userName, 15, 77)
//       doc.text(salesOrder.customer.shipmentAddress, 15, 84)
//       doc.text(`Phone: ${salesOrder.customer.phone}`, 15, 91)
//       doc.text(`Email: ${salesOrder.customer.customerEmail}`, 15, 98)
      
//       // Add sales details
//       doc.text(`Sales Manager: ${salesOrder.salesManager}`, 120, 70)
//       doc.text(`Supplier: ${salesOrder.supplier.name} (${salesOrder.supplier.code})`, 120, 77)
//       doc.text(`Payment: ${salesOrder.paymentTerm}`, 120, 84)
//       doc.text(`Currency: ${salesOrder.currency}`, 120, 91)
      
//       // Create table for items
//       const tableColumn = ["Product", "Qty", "VAT %", "VAT Amount", "Total"]
//       const tableRows:any = []
      
//       salesOrder.items.forEach(item => {
//         const itemData = [
//           item.product.toString(),
//           item.quantity,
//           `${item.vat}%`,
//           `${salesOrder.currency} ${item.vatAmount.toFixed(2)}`,
//           `${salesOrder.currency} ${item.totalAmount.toFixed(2)}`
//         ]
//         tableRows.push(itemData)
//       })
      
//       doc.autoTable({
//         head: [tableColumn],
//         body: tableRows,
//         startY: 110,
//         theme: 'grid',
//         styles: { fontSize: 10 }
//       })
      
//       // Add totals at the bottom
//       const finalY = doc.lastAutoTable.finalY + 10
//       doc.text(`Net Total: ${salesOrder.currency} ${salesOrder.netTotal.toFixed(2)}`, 140, finalY)
//       doc.text(`Total VAT: ${salesOrder.currency} ${salesOrder.totalVat.toFixed(2)}`, 140, finalY + 7)
//       doc.text(`Total Amount: ${salesOrder.currency} ${salesOrder.totalAmount.toFixed(2)}`, 140, finalY + 14)
      
//       // Add notes if available
//       if (salesOrder.notes) {
//         doc.text('Notes:', 15, finalY + 30)
//         doc.text(salesOrder.notes, 15, finalY + 37)
//       }
      
//       // Add footer
//       doc.text('Thank you for your business!', 105, 280, { align: 'center' })
      
//       doc.save(`Invoice-${salesOrder.orderNumber}.pdf`)
//     } catch (error) {
//       console.error('Error generating PDF:', error)
//     }
    
//     setIsExporting(false)
//   }

//   const handleBack = () => {
//     // Navigate back logic - implement as needed
//     console.log("Navigating back...")
//   }

//   return (
//     <div className="flex flex-col md:flex-row w-full  overflow-hidden mx-auto">
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .invoice-container, .invoice-container * {
//             visibility: visible;
//           }
//           .invoice-container {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//         }
//       `}</style>
//       <div className="invoice-container flex-grow overflow-auto border border-gray-200 shadow-md bg-white">
//         <Card className="w-full border-0 overflow-auto shadow-none bg-white text-black">
//           <CardHeader className="space-y-1 border-b border-gray-200">
//             <CardTitle className="text-2xl font-bold">Invoice</CardTitle>
//             <div className="flex justify-between text-sm">
//               <div>
//                 <p>Invoice Number: <span className="font-semibold">{salesOrder.orderNumber}</span></p>
//                 <p>Date: <span className="font-semibold">{format(new Date(salesOrder.orderDate), 'dd/MM/yyyy')}</span></p>
//                 <p>Shipment Date: <span className="font-semibold">{format(new Date(salesOrder.shipmentDate), 'dd/MM/yyyy')}</span></p>
//                 <p>Status: <span className="font-semibold capitalize">{salesOrder.status}</span></p>
//               </div>
//               <div className="text-right text-muted">
//                 <p>Your Company Name</p>
//                 <p>Company Address Line 1</p>
//                 <p>Company Address Line 2</p>
//                 <p>Tax ID: 123456789</p>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-6 pt-6">
//             <div className="flex justify-between">
//               <div>
//                 <h3 className="font-semibold mb-1">Bill To:</h3>
//                 <p>{salesOrder.customer.userName}</p>
//                 <p>{salesOrder.customer.shipmentAddress}</p>
//                 <p>Phone: {salesOrder.customer.phone}</p>
//                 <p>Email: {salesOrder.customer.customerEmail}</p>
//               </div>
//               <div className="text-right">
//                 <h3 className="font-semibold mb-1">Sales Information:</h3>
//                 <p>Sales Manager: {salesOrder.salesManager}</p>
//                 <p>Supplier: {salesOrder.supplier.name} ({salesOrder.supplier.code})</p>
//                 <p>Payment Terms: {salesOrder.paymentTerm}</p>
//                 <p>Currency: {salesOrder.currency}</p>
//               </div>
//             </div>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Product</TableHead>
//                   <TableHead className="text-center">Qty</TableHead>
//                   <TableHead className="text-center">VAT %</TableHead>
//                   <TableHead className="text-center">VAT Amount</TableHead>
//                   <TableHead className="text-center">Total Amount</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {salesOrder.items.map((item, index) => (
//                   <TableRow key={index}>
//                     <TableCell className="font-medium">{item.product.name.toString()}</TableCell>
//                     <TableCell className="text-center">{item.quantity}</TableCell>
//                     <TableCell className="text-center">{item.vat}%</TableCell>
//                     <TableCell className="text-center">{salesOrder.currency} {item.vatAmount.toFixed(2)}</TableCell>
//                     <TableCell className="text-center">{salesOrder.currency} {item.totalAmount.toFixed(2)}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <div className="flex flex-col items-end space-y-1 text-sm">
//               <div className="flex justify-between w-1/2">
//                 <span className="font-medium">Net Total:</span>
//                 <span>{salesOrder.currency} {salesOrder.netTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between w-1/2">
//                 <span className="font-medium">VAT Total ({salesOrder.vatRate}%):</span>
//                 <span>{salesOrder.currency} {salesOrder.totalVat.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between w-1/2 font-semibold text-base mt-2 pt-2 border-t border-gray-200">
//                 <span>Total Amount:</span>
//                 <span>{salesOrder.currency} {salesOrder.totalAmount.toFixed(2)}</span>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex-col items-start space-y-2 text-sm border-t border-gray-200 mt-6">
//             {salesOrder.notes && (
//               <div>
//                 <p className="font-semibold">Notes:</p>
//                 <p>{salesOrder.notes}</p>
//               </div>
//             )}
//             <p className="mt-4">Thank you for your business!</p>
//           </CardFooter>
//         </Card>
//       </div>
//       <div className="bg-gray-100 dark:bg-gray-800 p-6 md:w-64 flex flex-col space-y-4">
//         <h2 className="text-xl font-bold mb-4">Invoice Actions</h2>
//         <Button 
//           onClick={handleBack} 
//           className="w-full"
//           variant="outline"
//         >
//           <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
//         </Button>
//         <Button 
//           onClick={handlePrint} 
//           disabled={isPrinting} 
//           className="w-full"
//         >
//           <PrinterIcon className="mr-2 h-4 w-4" /> {isPrinting ? 'Printing...' : 'Print Invoice'}
//         </Button>
//         <Button 
//           onClick={handleDownloadPDF} 
//           disabled={isExporting} 
//           className="w-full"
//           variant="secondary"
//         >
//           <DownloadIcon className="mr-2 h-4 w-4" /> {isExporting ? 'Exporting...' : 'Export PDF'}
//         </Button>
//       </div>
//     </div>
//   )
// }



"use client"
import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PrinterIcon, DownloadIcon, ArrowLeftIcon } from 'lucide-react'
import { format } from 'date-fns'

// Import jsPDF correctly
import { jsPDF } from "jspdf"
// Import autotable as a separate import
import autoTable from 'jspdf-autotable'

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


interface InvoiceType{
  salesOrder:SalesOrder
}
export default function Invoice({ salesOrder }:InvoiceType) {
  const [isPrinting, setIsPrinting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // If no sales order is provided, return empty state
  if (!salesOrder) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No invoice data available</p>
      </div>
    )
  }

  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setTimeout(() => setIsPrinting(false), 500)
  }

  const handleDownloadPDF = () => {
    setIsExporting(true)
    
    try {
      // Create a new document
      const doc = new jsPDF()
      
      // Add company logo/header
      doc.setFontSize(20)
      doc.text('INVOICE', 105, 20, { align: 'center' })
      
      // Add invoice details
      doc.setFontSize(12)
      doc.text(`Invoice Number: ${salesOrder.orderNumber}`, 15, 40)
      doc.text(`Date: ${format(new Date(salesOrder.orderDate), 'dd/MM/yyyy')}`, 15, 47)
      doc.text(`Shipment Date: ${format(new Date(salesOrder.shipmentDate), 'dd/MM/yyyy')}`, 15, 54)
      
      // Add customer details
      doc.text('Bill To:', 15, 70)
      doc.text(salesOrder.customer.userName, 15, 77)
      doc.text(salesOrder.customer.shipmentAddress, 15, 84)
      doc.text(`Phone: ${salesOrder.customer.phone}`, 15, 91)
      doc.text(`Email: ${salesOrder.customer.customerEmail}`, 15, 98)
      
      // Add sales details
      doc.text(`Sales Manager: ${salesOrder.salesManager}`, 120, 70)
      doc.text(`Supplier: ${salesOrder.supplier.name} (${salesOrder.supplier.code})`, 120, 77)
      doc.text(`Payment: ${salesOrder.paymentTerm}`, 120, 84)
      doc.text(`Currency: ${salesOrder.currency}`, 120, 91)
      
      // Create table for items
      const tableColumn = ["Product", "Qty", "VAT %", "VAT Amount", "Total"]
      const tableRows:any = []
      
      salesOrder.items.forEach(item => {
        const itemData = [
          item.product.toString(),
          item.quantity,
          `${item.vat}%`,
          `${salesOrder.currency} ${item.vatAmount.toFixed(2)}`,
          `${salesOrder.currency} ${item.totalAmount.toFixed(2)}`
        ]
        tableRows.push(itemData)
      })
      
      // Create the table using autoTable directly
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 110,
        theme: 'grid',
        styles: { fontSize: 10 }
      })
      
      // Get the final Y position where the table ends
      const finalY = (doc as any).lastAutoTable.finalY + 10
      
      // Add totals at the bottom
      doc.text(`Net Total: ${salesOrder.currency} ${salesOrder.netTotal.toFixed(2)}`, 140, finalY)
      doc.text(`Total VAT: ${salesOrder.currency} ${salesOrder.totalVat.toFixed(2)}`, 140, finalY + 7)
      doc.text(`Total Amount: ${salesOrder.currency} ${salesOrder.totalAmount.toFixed(2)}`, 140, finalY + 14)
      
      // Add notes if available
      if (salesOrder.notes) {
        doc.text('Notes:', 15, finalY + 30)
        doc.text(salesOrder.notes, 15, finalY + 37)
      }
      
      // Add footer
      doc.text('Thank you for your business!', 105, 280, { align: 'center' })
      
      // Save the PDF
      doc.save(`Invoice-${salesOrder.orderNumber}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
    
    setIsExporting(false)
  }

  const handleBack = () => {
    // Navigate back logic - implement as needed
    console.log("Navigating back...")
  }

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl  overflow-hidden mx-auto">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      <div className="invoice-container flex-grow overflow-auto border border-gray-200  shadow-md bg-white">
        <Card className="w-full border-0 shadow-none bg-white text-black ">
          <CardHeader className="space-y-1 border-b border-gray-200">
            <CardTitle className="text-2xl font-bold">Invoice</CardTitle>
            <div className="flex justify-between text-sm">
              <div>
                <p>Invoice Number: <span className="font-semibold">{salesOrder.orderNumber}</span></p>
                <p>Date: <span className="font-semibold">{format(new Date(salesOrder.orderDate), 'dd/MM/yyyy')}</span></p>
                <p>Shipment Date: <span className="font-semibold">{format(new Date(salesOrder.shipmentDate), 'dd/MM/yyyy')}</span></p>
                <p>Status: <span className="font-semibold capitalize">{salesOrder.status}</span></p>
              </div>
              <div className="text-right text-muted">
                <p>Your Company Name</p>
                <p>Company Address Line 1</p>
                <p>Company Address Line 2</p>
                <p>Tax ID: 123456789</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold mb-1">Bill To:</h3>
                <p>{salesOrder.customer.userName}</p>
                <p>{salesOrder.customer.shipmentAddress}</p>
                <p>Phone: {salesOrder.customer.phone}</p>
                <p>Email: {salesOrder.customer.customerEmail}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold mb-1">Sales Information:</h3>
                <p>Sales Manager: {salesOrder.salesManager}</p>
                <p>Supplier: {salesOrder.supplier.name} ({salesOrder.supplier.code})</p>
                <p>Payment Terms: {salesOrder.paymentTerm}</p>
                <p>Currency: {salesOrder.currency}</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-center">VAT %</TableHead>
                  <TableHead className="text-center">VAT Amount</TableHead>
                  <TableHead className="text-center">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesOrder.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.product.name.toString()}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{item.vat}%</TableCell>
                    <TableCell className="text-center">{salesOrder.currency} {item.vatAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{salesOrder.currency} {item.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col items-end space-y-1 text-sm">
              <div className="flex justify-between w-1/2">
                <span className="font-medium">Net Total:</span>
                <span>{salesOrder.currency} {salesOrder.netTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-1/2">
                <span className="font-medium">VAT Total ({salesOrder.vatRate}%):</span>
                <span>{salesOrder.currency} {salesOrder.totalVat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-1/2 font-semibold text-base mt-2 pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span>{salesOrder.currency} {salesOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start space-y-2 text-sm border-t border-gray-200 mt-6">
            {salesOrder.notes && (
              <div>
                <p className="font-semibold">Notes:</p>
                <p>{salesOrder.notes}</p>
              </div>
            )}
            <p className="mt-4">Thank you for your business!</p>
          </CardFooter>
        </Card>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-6 md:w-64 flex flex-col space-y-4">
        <h2 className="text-xl font-bold mb-4">Invoice Actions</h2>
        <Button 
          onClick={handleBack} 
          className="w-full"
          variant="outline"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={handlePrint} 
          disabled={isPrinting} 
          className="w-full"
        >
          <PrinterIcon className="mr-2 h-4 w-4" /> {isPrinting ? 'Printing...' : 'Print Invoice'}
        </Button>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={isExporting} 
          className="w-full"
          variant="secondary"
        >
          <DownloadIcon className="mr-2 h-4 w-4" /> {isExporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      </div>
    </div>
  )
}