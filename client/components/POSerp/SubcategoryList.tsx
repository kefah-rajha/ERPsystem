import React from 'react';
import { Category } from '../types';

interface SubcategoryListProps {
  subcategories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string) => void;
}

export default function SubcategoryList({ 
  subcategories, 
  selectedCategory, 
  onSelectCategory 
}: SubcategoryListProps) {
  if (subcategories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {subcategories.map((subcat) => (
        <button
          key={subcat.id}
          onClick={() => onSelectCategory(subcat.id)}
          className={`p-3 rounded-lg text-sm transition-all ${
            selectedCategory === subcat.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {subcat.name}
        </button>
      ))}
    </div>
  );
}