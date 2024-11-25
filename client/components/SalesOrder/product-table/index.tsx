"use client"

import { useContext, useEffect, useState } from "react"
import { Package2 } from "lucide-react"
import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder"
import { Card } from "@/components/ui/card"
import { ProductList } from "@/components/SalesOrder/product-table/ProductList"
import { SelectedProducts } from "@/components/SalesOrder/product-table/SelectedProducts"
import { SectionHeader } from "@/components/SalesOrder/product-table/SectionHeader"
import {SalesOrderProductsSelectedContext} from "@/context/saleOrderSelectedProducts"
interface ProductTableProps {
  products: ProductSalesOrder[]
}

export default function ProductTable({ products }: ProductTableProps) {
  const salesOrderProductsSelectedContext =useContext(SalesOrderProductsSelectedContext)

  const [selectedProducts, setSelectedProducts] = useState<ProductSalesOrder[]>([])
  useEffect(() => {
    salesOrderProductsSelectedContext?.setSalesOrderProductsSelected(selectedProducts)
  },[salesOrderProductsSelectedContext, selectedProducts])

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
    </div>
  )
}