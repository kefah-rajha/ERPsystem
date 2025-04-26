"use client"

import { useContext, useEffect, useState } from "react"
import { Package2 } from "lucide-react"
import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder"
import { Card } from "@/components/ui/card"
import { ProductList } from "@/components/SalesOrder/product-table/ProductList"
import { SelectedProducts } from "@/components/SalesOrder/product-table/SelectedProducts"
import { SectionHeader } from "@/components/SalesOrder/product-table/SectionHeader"
import {PurchaseOrderProductsSelectedContext} from "@/context/pucahseOrderProducts"
import { Button } from "@/components/ui/button"
interface ProductTableProps {
  products: ProductSalesOrder[]
  closeDialog:(close:boolean)=>void
}

export default function ProductTable({ products ,closeDialog}: ProductTableProps) {
  const salesOrderProductsSelectedContext =useContext(PurchaseOrderProductsSelectedContext)

  const [selectedProducts, setSelectedProducts] = useState<ProductSalesOrder[]>([])
  console.log(selectedProducts,"selectedProducts")
  const confirmSelectedProductsFun=() => {
    console.log("test Click")
    salesOrderProductsSelectedContext?.setPurchaseOrderProductsSelected(selectedProducts)
    closeDialog(false)
  
  }
  

  const handleSelect = (product: ProductSalesOrder) => {
    setSelectedProducts(prev => 
      prev.find(p => p._id === product._id)
        ? prev.filter(p => p._id !== product._id)
        : [...prev, product]
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <SectionHeader icon={Package2} title="Products List" />
        </div>
        <ProductList
          products={products}
          selectedProducts={selectedProducts}
          onSelect={handleSelect}
        />
      </Card>

      <Card className="p-6">
        <SelectedProducts
          products={selectedProducts}
          onRemove={handleSelect}
        />
      </Card>
      <div className="flex justify-end ">
      <Button variant="default" onClick={()=>confirmSelectedProductsFun()}>Save changes</Button>
      </div>
    </div>
  )
}