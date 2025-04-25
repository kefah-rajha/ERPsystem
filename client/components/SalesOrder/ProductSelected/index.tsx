"use client"

import { useSearchParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { Calculator } from "lucide-react"
import {  Product, VATOption } from "@/dataType/test"
import { Card } from "@/components/ui/card"
import { ProductSelectedTable } from "@/components/SalesOrder/ProductSelected/ProductSelectedTable"
import { TotalAmount } from "@/components/SalesOrder/ProductSelected/TotalAmount"
import {SalesOrderProductsSelectedContext} from "@/context/saleOrderSelectedProducts"
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

interface ProductSelectedType {
 getTotalAmount:(amount:number)=>void
 handleOrderProductsSelected:(ProductSelected:itemsOrder[])=>void
 itemsProduct?:itemsOrder[]
}

export default function ProductSelected({getTotalAmount,handleOrderProductsSelected,itemsProduct}:ProductSelectedType) {
    const salesOrderProductsSelectedContext =useContext(SalesOrderProductsSelectedContext)
console.log(itemsProduct,"itemsProductitemsProduct")
  const [orderItems, setOrderItems] = useState<itemsOrder[] >([])
  
  const ProductSelected= salesOrderProductsSelectedContext?.salesOrderProductsSelected
  useEffect(() => {
    if (itemsProduct && itemsProduct.length > 0) {
      console.log("Setting orderItems from itemsProduct:", itemsProduct);
      setOrderItems([...itemsProduct]); // Create a new array to ensure state update
    }
  }, [itemsProduct]);
useEffect(()=>{
  handleOrderProductsSelected(orderItems)
},[handleOrderProductsSelected, orderItems])
  useEffect(() => {
    if(ProductSelected !==undefined){
    
    const items:itemsOrder[]  = ProductSelected?.map(product => ({
      ...product,
      quantity: 1,
      vat: 0,
      vatAmount: 0,
      totalAmount: +product.price
    })) 
    setOrderItems(items)}
  }, [ProductSelected])

  const handleQuantityChange = (id: string, quantity: number) => {
   
    setOrderItems((prev :itemsOrder[]):itemsOrder[] => prev?.map((item:itemsOrder):itemsOrder => {
      if (item._id !== id) return item
      const newQuantity = Math.max(1, Math.min(quantity, +item.stock))
      const subtotal = +item.price * newQuantity
      const vatAmount = subtotal * (item.vat / 100)
      return {
        ...item,
        quantity: newQuantity,
        vatAmount,
        totalAmount: subtotal + vatAmount
      }
    }))
  }

  const handleVATChange = (id: string, option: VATOption) => {
    setOrderItems(prev => prev.map(item => {
      if (item._id != id) return item
      const subtotal = +item.price * item.quantity
      const vatAmount = subtotal * option.rate
      return {
        ...item,
        vat: Number(option.value),
        vatAmount,
        totalAmount: subtotal + vatAmount
      }
    }))
  }
  const handleDelete = (id: string) => {
    setOrderItems(prev => prev.filter(item => item._id != id))
  }
  const totalAmount = orderItems.reduce((sum, item) => sum + item.totalAmount, 0)
  useEffect(()=>{
    getTotalAmount(totalAmount)
    
  },[getTotalAmount, totalAmount])

  return (
    <main className=" mx-auto py-5 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Review and confirm your order details below.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>

          <ProductSelectedTable
            items={orderItems}
            onQuantityChange={handleQuantityChange}
            onVATChange={handleVATChange}
            onDelete={handleDelete}
          />

          <TotalAmount amount={totalAmount} />
        </div>
      </Card>
    </main>
  )
}