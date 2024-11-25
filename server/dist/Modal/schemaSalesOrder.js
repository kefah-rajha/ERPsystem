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
        required: true
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
    customer: {
        name: {
            type: String,
            required: true
        },
        contact: {
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
}, {
    timestamps: true
});
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
exports.SalesOrderModel = (0, mongoose_1.model)('SalesOrder', SalesOrderSchema);
