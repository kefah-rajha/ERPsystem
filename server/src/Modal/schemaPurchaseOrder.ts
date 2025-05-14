import mongoose, { model, Schema } from 'mongoose';

// Interface for an item in a purchase order
interface PurchaseOrderItem {
  product: mongoose.Types.ObjectId; // Link to the product
  quantity: number;                 // Quantity requested
  unitPrice: number;                // Unit price (cost before tax)
  vat: number;                      // VAT percentage for this item
  vatAmount: number;                // Calculated VAT amount for the item
  totalAmount: number;              // Total for the item (quantity * price + VAT)
}

// Interface for a supplier
interface Supplier {
  name: string;
  contactPerson?: string;
  supplierEmail?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  // You can add an ObjectId reference if suppliers are in a separate collection
  // _id?: mongoose.Types.ObjectId;
}

// Interface for a purchase order
interface PurchaseOrder {
  purchaseOrderNumber: string;    // Purchase order number
  orderDate: Date;                // Date the order was created
  expectedDeliveryDate: Date;     // Expected delivery date
  requestedBy?: string;           // Name or ID of the requester (from your company)
  // or requestedBy: mongoose.Types.ObjectId;
  supplier: Supplier;             // Supplier details (can be an embedded object or ObjectId)
  // or supplier: mongoose.Types.ObjectId; ref: 'Suppliers'
  shippingAddress: string;        // Shipping address (to your company)
  items: PurchaseOrderItem[];      // Purchase order items
  netTotal: number;               // Net total (before tax)
  totalVat: number;               // Total VAT
  totalAmount: number;            // Final total (including tax)
  status: "draft" | "pending_approval" | "approved" | "ordered" | "partially_received" | "received" | "cancelled"; // Order status
  notes?: string;                 // Notes
  currency: string;               // Currency
  paymentTerm: "Net 30" | "Net 60" | "Due on Receipt" | "Cash On Delivery" | string; // Payment terms for the supplier
  // You might need vatRate and includeVat if prices are entered differently
   vatRate?: number;
     bankAccount:string,
   
  // includeVat?: boolean;
}

// --- Mongoose Schemas (Simplified Example) ---

const PurchaseOrderItemSchema = new Schema<PurchaseOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }, // Unit price is very important
  vat: { type: Number, required: true, default: 0 },
  vatAmount: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true, default: 0 }
}, { _id: false }); // Usually order items don't need a separate ID unless you frequently edit them individually

const SupplierSchema = new Schema<Supplier>({
    name: { type: String, required: true },
    contactPerson: String,
    supplierEmail: String,
    phone: String,
    address: String,
    taxId: String
}, { _id: false }); // As an example of embedding, or make it a separate collection with _id

const PurchaseOrderSchema = new Schema<PurchaseOrder>({
  purchaseOrderNumber: { type: String, required: true, unique: true },
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date, required: true },
  requestedBy: { type: String }, // or type: Schema.Types.ObjectId, ref: 'Users'
  supplier: { type: SupplierSchema, required: true }, // As an example of embedding
  // or supplier: { type: Schema.Types.ObjectId, ref: 'Suppliers', required: true }
  shippingAddress: { type: String, required: true },
  items: [PurchaseOrderItemSchema],
  netTotal: { type: Number, required: true, default: 0 },
  totalVat: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true, default: 0 },
  vatRate: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, enum: ["draft", "pending_approval", "approved", "ordered", "partially_received", "received", "cancelled"], default: "draft" },
  notes: String,
  currency: { type: String, required: true, default: 'USD' },
   bankAccount: {
      type: String,
      required: true
    },
  paymentTerm: { type: String, required: true }
}, { timestamps: true }); // Automatically add createdAt and updatedAt


export const PurchaseOrderModel = model<PurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
