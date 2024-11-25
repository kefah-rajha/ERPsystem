import { Badge } from "@/components/ui/badge"

interface ProductCategoryProps {
  category: string
}

export function ProductCategory({ category }: ProductCategoryProps) {
  return (
    <Badge variant="secondary">
      {category}
    </Badge>
  )
}