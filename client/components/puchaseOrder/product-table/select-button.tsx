"use client"
import { Button } from "@/components/ui/button"
import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder"

interface SelectButtonProps {
  product: ProductSalesOrder
  isSelected: boolean
  onSelect: (product: ProductSalesOrder) => void
}

export function SelectButton({ product, isSelected, onSelect }: SelectButtonProps) {
  return (
    <Button
      variant={isSelected ? "secondary" : "default"}
      onClick={() => onSelect(product)}
    >
      {isSelected ? "Selected" : "Select"}
    </Button>
  )
}