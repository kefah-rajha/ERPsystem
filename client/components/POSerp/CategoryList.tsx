import React, { useMemo, useState, useRef } from 'react';
// import { Category } from '../types';
import { Layout, ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from './CategoryCard';
import NestedCategories from './categories/NestedCategories';
import { Button } from './ui/button';
import { getCategoryLevel, getSubcategories } from '@/lib/category-utils';
import { categoriesResponseData } from "@/dataType/dataTypeCategory/dataTypeCategory";

interface CategoryListProps {
  categories: categoriesResponseData[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const mainCategories = useMemo(
    () => categories.filter(cat => cat.mainCategory == true),
    [categories]
  );

  const selectedCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find(c => c._id === selectedCategory);
  }, [categories, selectedCategory]);
  console.log(selectedCategoryData, selectedCategory, "selectedCategory")


  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:text-orange-400 transition-colors"
        >
          <Layout className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Categories</h2>
        </button>
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedCategory === null
            ? 'bg-orange-300 text-white'
            : 'bg-orange-600 hover:bg-orange-600 '
            }`}
        >
          All Products
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-8">
          <div className="relative ">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />

            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="rounded-full shadow-lg  backdrop-blur-sm hover:bg-background/90 transition-all border-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div
              ref={carouselRef}
              className="flex custom-scrollbar overflow-x-auto gap-4 px-6 ml-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            >
              {mainCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex-none w-1/4  snap-start "
                >
                  <CategoryCard
                    category={category}
                    isSelected={selectedCategoryData?._id === category._id}
                    onClick={() => onSelectCategory(category._id)}
                  />
                </div>
              ))}
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all border-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedCategoryData && (
            <NestedCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
            />
          )}
        </div>
      )}
    </div>
  );
}