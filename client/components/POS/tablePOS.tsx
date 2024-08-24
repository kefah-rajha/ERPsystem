
"use client"

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import React from "react"
import { ChevronDown } from 'lucide-react';

type ProductAttrubite = {
    id: number;
    name: string;
    price: string;
    Discount: string;
    Quantity: number;
    subTotal: string;
    photo: string;
  };
  interface productsType{
    products:ProductAttrubite[]
  }

export default function TablePOS({products}:productsType) {
 
  return (
    <div className="bg-[#454545] rounded-lg overflow-hidden mt-4">
      <Table>
        <TableHeader className="bg-[#454545] text-white">
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">SubTotal</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-center">More</TableHead>
            <TableHead className="w-[80px] text-center">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-[#454545] text-white">
          {products.map((product :ProductAttrubite, index:any) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell className="font-medium text-center">{product.name}</TableCell>
                <TableCell className="text-center">${product.price}</TableCell>
                <TableCell className="text-center">${product.subTotal}</TableCell>
                <TableCell className="text-center">{product.Quantity}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon">
                    <ChevronDown  className="h-4 w-4 " />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" className="text-center">
                        <ListIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <TableRow className="bg-[#3a3a3a]">
                <TableCell colSpan={6} className="hidden">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
                    <div className="grid gap-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">Additional details about the product.</div>
                    </div>
                    <Button variant="outline">Add to cart</Button>
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ArrowDownIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  )
}


function ListIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}