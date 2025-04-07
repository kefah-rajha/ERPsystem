import React, { useMemo } from 'react';
import { getSubcategories, getCategoryLevel } from '@/lib/category-utils';
import { ChevronRight } from 'lucide-react';
import { categoriesResopnseData } from "@/dataType/dataTypeCategory/dataTypeCategory";

interface NestedCategoriesProps {
  categories: categoriesResopnseData[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export default function NestedCategories({
  categories,
  selectedCategory,
  onSelectCategory
}: NestedCategoriesProps) {
  const categoryPath = useMemo(() => {
    if (!selectedCategory) return [];

    const path: categoriesResopnseData[] = [];
    let currentCat: categoriesResopnseData | null | undefined = categories.find(c => c._id === selectedCategory);
    console.log(currentCat, "currentCat")

    while (currentCat) {
      path.unshift(currentCat);
      currentCat = currentCat.parent
        ? categories.find(c => c._id === currentCat?.parent)
        : null;
    }

    return path;
  }, [categories, selectedCategory]);

  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return getSubcategories(categories, selectedCategory);
  }, [categories, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      {categoryPath.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {categoryPath.map((cat, index) => (
            <React.Fragment key={cat._id}>
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              <button
                onClick={() => onSelectCategory(cat._id)}
                className="hover:text-foreground transition-colors"
              >
                {cat.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Subcategories grid */}
      {subcategories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {subcategories.map((subcat) => (
            <button
              key={subcat._id}
              onClick={() => onSelectCategory(subcat._id)}
              className="p-3 rounded-lg text-sm transition-all  card-gradient hover:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <span>{subcat.name}</span>
                {getSubcategories(categories, subcat._id).length > 0 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}