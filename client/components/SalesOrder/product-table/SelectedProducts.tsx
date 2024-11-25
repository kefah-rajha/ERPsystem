"use client"

import { ShoppingCart } from "lucide-react"
import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/SalesOrder/product-table/product-image"
import { SectionHeader } from "@/components/SalesOrder/product-table/SectionHeader"

interface SelectedProductsProps {
  products: ProductSalesOrder[]
  onRemove: (product: ProductSalesOrder) => void
}

export function SelectedProducts({ products, onRemove }: SelectedProductsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader icon={ShoppingCart} title="Selected Products" />
        <Badge variant="secondary">
          {products.length} items
        </Badge>
      </div>
      <ScrollArea className="h-[200px] rounded-md border">
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No products selected
          </p>
        ) : (
          <div className="space-y-4 p-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  <ProductImage src="/1.png" alt={product.name} size="small" />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${product.price}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(product)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}