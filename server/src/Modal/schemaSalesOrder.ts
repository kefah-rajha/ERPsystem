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
  contact: string;
  phone: string;
}

interface SalesStaff {
  name: string;
  code: string;
}

interface SalesOrder {
  orderNumber: string;
  orderDate: Date;
  customer: Customer;
  salesStaff: SalesStaff;
  items: OrderItem[];
  subtotal: number;
  totalVat: number;
  grandTotal: number;
  status: 'pending' | 'processed' | 'completed' | 'cancelled';
  notes?: string;
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
    required: true
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
    customer: {
      name: {
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
      }
    },
    salesStaff: {
      name: {
        type: String,
        required: true
      },
      code: {
        type: String,
        required: true
      }
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    totalVat: {
      type: Number,
      required: true
    },
    grandTotal: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: String
  },
  {
    timestamps: true
  }
);

// Indexes
SalesOrderSchema.index({ orderNumber: 1 });
SalesOrderSchema.index({ 'customer.name': 1 });
SalesOrderSchema.index({ orderDate: -1 });

// Virtual populate setup
SalesOrderSchema.virtual('productDetails', {
  ref: 'Products',
  localField: 'items.product',
  foreignField: '_id'
});

// Export the model
export const SalesOrderModel = model<SalesOrder>('SalesOrder', SalesOrderSchema);