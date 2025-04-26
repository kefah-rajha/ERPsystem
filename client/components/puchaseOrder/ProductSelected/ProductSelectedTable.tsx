"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {  Product, VATOption } from "@/dataType/test"
interface itemsOrder {
    
  quantity: number;
  vat: number;
  vatAmount: number;
  totalAmount: number;
  _id: string;
  name: string;
  SKU: string;
  brandName: string;
  productTag: string;
  price: string;
  Discount: string;
  SupplierName: string;
  salesCode: string;
  purchaseCode: string;
  supplierCode: string;
  Description: string;
  stock:string;
}

export const VAT_OPTIONS = [
    { value: "0", label: "0%", rate: 0 },
    { value: "5", label: "5%", rate: 0.05 },
    { value: "10", label: "10%", rate: 0.10 },
    { value: "15", label: "15%", rate: 0.15 }
  ]

interface OrderSummaryTableProps {
  items: itemsOrder[]
  onQuantityChange: (id: string, quantity: number) => void
  onVATChange: (id: string, option: VATOption) => void
  onDelete: (id: string) => void
}

export  function ProductSelectedTable({
  items,
  onQuantityChange,
  onVATChange ,
  onDelete
}: OrderSummaryTableProps) {
  console.log(items,"itemsitemsitems")
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead className="text-right">Available</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>VAT</TableHead>
          <TableHead className="text-right">VAT Amount</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item._id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.SKU|| "-"}</TableCell>
            <TableCell className="text-right">{item.stock}</TableCell>
            <TableCell className="text-right">
              <Input
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(e) => onQuantityChange(item._id, parseInt(e.target.value) || 1)}
                className="w-20 text-right"
              />
            </TableCell>
            <TableCell className="text-right">
              ${item.price}
            </TableCell>
            <TableCell>
              <Select
                value={item.vat.toString()}
                onValueChange={(value) => {
                  const option = VAT_OPTIONS.find(opt => opt.value === value)
                  if (option) onVATChange(item._id, option)
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VAT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-right">
              ${item.vatAmount.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              ${item.totalAmount.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(item._id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}