"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderModel = void 0;
const mongoose_1 = require("mongoose");
// Schemas
const OrderItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const SalesOrderSchema = new mongoose_1.Schema({
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
    includeVat: {
        type: Boolean,
        required: true
    },
    salesManager: {
        type: String,
        required: true
    },
    paymentTerm: {
        type: String,
        enum: ["Cash",
            "Card",
            "Bank Transfers",
            "Checks",
            "Electronic Payments",
            "Deferred Payments"],
        default: 'Cash'
    },
    notes: String
}, {
    timestamps: true
});
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
exports.SalesOrderModel = (0, mongoose_1.model)('SalesOrder', SalesOrderSchema);
