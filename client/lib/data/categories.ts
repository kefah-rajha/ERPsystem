import { Category } from '../types';

export const categories: Category[] = [
  { 
    id: '1', 
    name: 'Electronics', 
    description: 'Electronic devices and gadgets' 
  },
  { 
    id: '2', 
    name: 'Fashion', 
    description: 'Clothing and accessories' 
  },
  { 
    id: '3', 
    name: 'Home & Living', 
    description: 'Furniture and home decor' 
  },
  { 
    id: '4', 
    name: 'Books', 
    description: 'Books and publications' 
  },
  { 
    id: '5', 
    name: 'Sports', 
    description: 'Sports equipment and gear' 
  },
  // Electronics subcategories
  { id: '1-1', name: 'Laptops', parentId: '1' },
  { id: '1-2', name: 'Smartphones', parentId: '1' },
  { id: '1-3', name: 'Accessories', parentId: '1' },
  // Fashion subcategories
  { id: '2-1', name: 'Men', parentId: '2' },
  { id: '2-2', name: 'Women', parentId: '2' },
  { id: '2-3', name: 'Kids', parentId: '2' },
  // Home subcategories
  { id: '3-1', name: 'Furniture', parentId: '3' },
  { id: '3-2', name: 'Decor', parentId: '3' },
  { id: '3-3', name: 'Kitchen', parentId: '3' },
  // Books subcategories
  { id: '4-1', name: 'Fiction', parentId: '4' },
  { id: '4-2', name: 'Non-Fiction', parentId: '4' },
  { id: '4-3', name: 'Academic', parentId: '4' },
  // Sports subcategories
  { id: '5-1', name: 'Fitness', parentId: '5' },
  { id: '5-2', name: 'Outdoor', parentId: '5' },
  { id: '5-3', name: 'Team Sports', parentId: '5' },
];