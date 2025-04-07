import { useMemo } from 'react';
import { categories } from '@/lib/data/categories';
import { products } from  "@/lib/data/products"

export function useFilteredProducts(selectedCategory: string | null) {
  return useMemo(() => {
    if (!selectedCategory) return products;
    
    const category = categories.find(c => c.id === selectedCategory);
    if (!category?.parentId) {
      const subcategoryIds = categories
        .filter(c => c.parentId === selectedCategory)
        .map(c => c.id);
      return products.filter(p => 
        p.categoryId === selectedCategory || subcategoryIds.includes(p.categoryId)
      );
    }
    return products.filter(p => p.categoryId === selectedCategory);
  }, [selectedCategory]);
}