"use client"
import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PrinterIcon, DownloadIcon, ShoppingCartIcon, ArrowLeftIcon } from 'lucide-react'

export default function Invoice() {
  const [isPrinting, setIsPrinting] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const invoiceItems = [
    { description: "Ergonomic Office Chair", quantity: 2, price: 299.99, note: "Black leather, adjustable height" },
    { description: "Solid Oak Dining Table", quantity: 1, price: 799.99, note: "Seats 6, natural finish" },
    { description: "Modern Leather Sofa", quantity: 1, price: 1299.99, note: "3-seater, charcoal gray" },
    { description: "Adjustable Standing Desk", quantity: 1, price: 549.99, note: "Electric, white frame" },
    { description: "Minimalist Bookshelf", quantity: 2, price: 149.99, note: "5 shelves, walnut veneer" },
  ]

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const taxRate = 0.08
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setIsPrinting(false)
  }

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...")
  }

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true)
    setTimeout(() => {
      console.log("Placing order...")
      setIsPlacingOrder(false)
      setOrderPlaced(true)
    }, 1500)
  }

  const handleBack = () => {
    console.log("Navigating back...")
  }

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto">
      <style jsx global>{`
        .invoice-container {
          background-color: white !important;
          color: black !important;
        }
        .invoice-container * {
          color: black !important;
        }
        .invoice-container .text-muted {
          color: #666 !important;
        }
        .invoice-container table {
          border-collapse: separate;
          border-spacing: 0;
        }
        .invoice-container th {
          border-bottom: 2px solid #e0e0e0 !important;
          font-weight: 600 !important;
        }
        .invoice-container td {
          border-bottom: 1px solid #e0e0e0 !important;
        }
        .invoice-container tr:last-child td {
          border-bottom: none !important;
        }
        .control-panel {
          background: linear-gradient(258deg, rgba(31, 31, 31, 1) 15%, rgba(48, 48, 48, 1) 77%, rgba(31, 31, 31, 1) 87%);
        }
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
      <div className="invoice-container heighWithOutBar overflow-auto flex-grow overflow-x-auto border border-gray-200 shadow-md ">
        <Card className="w-full border-0 shadow-none bg-white">
          <CardHeader className="space-y-1 border-b border-gray-200">
            <CardTitle className="text-2xl font-bold">Invoice</CardTitle>
            <div className="flex justify-between text-sm">
              <div>
                <p>Invoice Number: <span className="font-semibold">INV-2023-001</span></p>
                <p>Date: <span className="font-semibold">{new Date().toLocaleDateString()}</span></p>
              </div>
              <div className="text-right text-muted">
                <p>Cozy Home Furnishings</p>
                <p>789 Comfort Lane</p>
                <p>Furniture City, FC 54321</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold mb-1">Bill To:</h3>
              <p>Sarah Johnson</p>
              <p>Modern Living Interiors</p>
              <p>456 Design Avenue</p>
              <p>Stylish Town, ST 98765</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">${(item.quantity * item.price).toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-muted">{item.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col items-end space-y-1 text-sm">
              <div className="flex justify-between w-1/2">
                <span className="font-medium">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-1/2">
                <span className="font-medium">Tax ({(taxRate * 100).toFixed(0)}%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-1/2 font-semibold text-base mt-2 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start space-y-2 text-sm border-t border-gray-200 mt-6">
            <p><span className="font-semibold">Payment Terms:</span> Due within 30 days</p>
            <p><span className="font-semibold">Note:</span> Thank you for choosing Cozy Home Furnishings for your interior design needs!</p>
          </CardFooter>
        </Card>
      </div>
      <div className="control-panel text-white p-6 md:w-64 flex flex-col space-y-4">
        <h2 className="text-xl font-bold mb-4">Invoice Actions</h2>
        <Button onClick={handleBack} className="w-full bg-gray-700 hover:bg-gray-600">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handlePrint} disabled={isPrinting} className="w-full bg-blue-600 hover:bg-blue-500">
          <PrinterIcon className="mr-2 h-4 w-4" /> Print Invoice
        </Button>
        <Button onClick={handleDownloadPDF} className="w-full bg-green-600 hover:bg-green-500">
          <DownloadIcon className="mr-2 h-4 w-4" /> Download PDF
        </Button>
        <Button 
         
          className={`w-full ${orderPlaced ? 'bg-gray-600' : 'bg-yellow-600 hover:bg-yellow-500'}`}
        >
          <ShoppingCartIcon className="mr-2 h-4 w-4" /> Place Order
        </Button>
      </div>
    </div>
  )
}