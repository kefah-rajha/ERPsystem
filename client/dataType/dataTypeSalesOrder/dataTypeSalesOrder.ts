export interface ProductSalesOrder {
  _id: string,
  name: string,
  SKU: string,
  brandName: string,
  productTag: string,
  price: string,
  Discount: string,
  SupplierName: string,
  salesCode: string,
  purchaseCode: string,
  supplierCode: string,
  Description: string,
  stock: string;
}
interface OrderItemProduct {
  _id: string;
  name: string;
  price: string
}

export interface OrderItemType {
  product: OrderItemProduct;
  quantity: number;
  vat: number;
  vatAmount: number;
  totalAmount: number;
}

export interface CustomerSalesOrder {
  userName: string;
  shipmentAddress: string;
  phone: string;
  customerEmail: string;
}

interface SalesStaff {
  name: string;
  code: string;
}

export interface SalesOrderType {
  _id: string;
  orderNumber: string;
  orderDate: Date;
  shipmentDate: Date;
  customer: CustomerSalesOrder;
  supplier: SalesStaff;
  items: OrderItemType[];
  netTotal: number;
  totalVat: number;
  totalAmount: number;
  status: 'pending' | 'processed' | 'completed' | 'cancelled';
  notes?: string;
  vatRate: number,
  includeVat: false,
  currency: string,
  salesManager: string,
  paymentTerm: "Cash" |
  "Card" |
  "Bank Transfers" |
  "Checks" |
  "Electronic Payments" |
  "Deferred Payments",
}