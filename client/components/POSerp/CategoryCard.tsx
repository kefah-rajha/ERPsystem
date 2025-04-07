import React from 'react';
import { Category } from '../types';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl transition-all ${
        isSelected
          ? 'bg-blue-600 text-white shadow-lg scale-105'
          : ' card-gradient   hover:bg-gray-700 shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{category.name}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
      {category.description && (
        <p className="text-sm mt-1 opacity-80 line-clamp-2">{category.description}</p>
      )}
    </button>
  );
}