export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface Product {
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

export interface CartItem extends Product {
  quantity: number;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

export interface CartSettings {
  currency: Currency;
  customVatRate: number | null;
}

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  createdAt: Date;
  status: OrderStatus;
  total: number;
  items: CartItem[];
  customerName?: string;
  customerEmail?: string;
  invoiceGenerated: boolean;
}