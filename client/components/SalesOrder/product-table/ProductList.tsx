"use client"

import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductImage } from "@/components/SalesOrder/product-table/product-image"
import { ProductCategory } from "@/components/SalesOrder/product-table/product-category"
import { SelectButton } from "@/components/SalesOrder/product-table/select-button"

interface ProductListProps {
  products: ProductSalesOrder[]
  selectedProducts: ProductSalesOrder[]
  onSelect: (product: ProductSalesOrder) => void
}

export function ProductList({ products, selectedProducts, onSelect }: ProductListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell>
              <ProductImage src="/1.png" alt={product.name} />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>
              <ProductCategory category={product.Discount} />
            </TableCell>
            <TableCell className="text-right">
              ${product.price}
            </TableCell>
            <TableCell className="text-right">{product.SKU}</TableCell>
            <TableCell className="text-right">
              <SelectButton
                product={product}
                isSelected={selectedProducts.some(p => p._id === product._id)}
                onSelect={onSelect}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}