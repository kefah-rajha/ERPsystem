"use client"

import React from 'react';
import { Package, PackageX } from 'lucide-react';
import ProductCard from './ProductCard';

interface ProductAttribute {
  _id:string;
  name: string;
  SKU: string;
  brandName: string;
  productTag: string;
  price: number;
  Discount: string;
  stock: string,
  SupplierName: string;
  salesCode: string;
  purchaseCode: string;
  supplierCode: string;
  trackInventory: boolean;
  allowOutOfStock: boolean;
  Description: string;
  vat: string;
  categories: string;
  subCategories: string[];
  photos:string []
}

interface ProductGridProps {
  products: [ProductAttribute] | ProductAttribute[] | undefined;
  onAddToCart: (product: ProductAttribute, quantity: number) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Products</h2>
      </div>

      {products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <PackageX className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No Products Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            There are no products available in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}