import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro',
    price: 1299.99,
    categoryId: '1-1',
    stock: 10,
    description: 'High-performance laptop with M2 chip',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    hasVAT: true,
    vatRate: 20
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    price: 999.99,
    categoryId: '1-2',
    stock: 15,
    description: 'Latest iPhone with pro camera system',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab',
    hasVAT: true,
    vatRate: 20
  },
  {
    id: '3',
    name: 'Leather Jacket',
    price: 199.99,
    categoryId: '2-1',
    stock: 20,
    description: 'Classic leather jacket for men',
    image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504',
    hasVAT: true,
    vatRate: 20
  },
  {
    id: '4',
    name: 'Modern Sofa',
    price: 899.99,
    categoryId: '3-1',
    stock: 5,
    description: 'Contemporary 3-seater sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    hasVAT: true,
    vatRate: 20
  },
  {
    id: '5',
    name: 'Best-Selling Novel',
    price: 24.99,
    categoryId: '4-1',
    stock: 50,
    description: 'Award-winning fiction book',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    hasVAT: false
  },
  {
    id: '6',
    name: 'Yoga Mat',
    price: 29.99,
    categoryId: '5-1',
    stock: 30,
    description: 'Premium non-slip yoga mat',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
    hasVAT: true,
    vatRate: 10
  }
];