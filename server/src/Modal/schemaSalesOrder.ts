import mongoose, { Schema, model, connect } from 'mongoose';

// Interfaces
interface OrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  vat: number;
  vatAmount: number;
  totalAmount: number;
}

interface Customer {
  name: string;
  shipmentAddress: string;
  phone: string;
  customerEmail: string;
}

interface SalesStaff {
  name: string;
  code: string;
}

interface SalesOrder {
  orderNumber: string;
  orderDate: Date;
  shipmentDate:Date;
  salesManager: string;
  customer: Customer;
  supplier: SalesStaff;
  items: OrderItem[];
  netTotal: number;
  totalVat: number;
  totalAmount: number;
  status: "pending" | "processed" | "completed" | "cancelled";
  notes?: string;
  vatRate: number,
  currency: string,
  bankAccount:string,
  paymentTerm:"Cash"|
  "Card" |
  "Bank Transfers" |
  "Checks" |
  "Electronic Payments" |
  "Deferred Payments",
}

// Schemas
const OrderItemSchema = new Schema<OrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Products', // Matches your Product model name
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  vat: {
    type: Number,
    required: true
  },
  vatAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    
  }
});

const SalesOrderSchema = new Schema<SalesOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    shipmentDate: {
      type: Date,
      default: Date.now
    },
    customer: {
      userName: {
        type: String,
        required: true
      },
      customerEmail: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      shipmentAddress: {
        type: String,
        required: true
      }
    },
    supplier: {
      name: {
        type: String,
        required: true
      },

    },
    items: [OrderItemSchema],
    netTotal: {
      type: Number,
      required: true
    },
    totalVat: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      
    },
    vatRate: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'completed', 'cancelled'],
      default: 'pending'
    },
    currency: {
      type: String,
      required: true
    },
    bankAccount: {
      type: String,
      required: true
    },

    salesManager: {
      type: String,
      required: true
    },
    paymentTerm: {
      type: String,
      enum: ["Cash",
        "Card" ,
        "Bank Transfers" ,
        "Checks" ,
        "Electronic Payments" ,
        "Deferred Payments"],
      default: 'Cash'
    },
    notes: String
  },
  {
    timestamps: true
  }
);

// Indexes
SalesOrderSchema.index({ 'customer.userName': 1 });
SalesOrderSchema.index({ orderDate: -1 });

// Virtual populate setup
SalesOrderSchema.virtual('productDetails', {
  ref: 'Products',
  localField: 'items.product',
  foreignField: '_id'
});

// Export the model
export const SalesOrderModel = model<SalesOrder>('SalesOrder', SalesOrderSchema);