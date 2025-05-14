"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderModel = void 0;
const mongoose_1 = require("mongoose");
// --- Mongoose Schemas (Simplified Example) ---
const PurchaseOrderItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }, // Unit price is very important
    vat: { type: Number, required: true, default: 0 },
    vatAmount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 }
}, { _id: false }); // Usually order items don't need a separate ID unless you frequently edit them individually
const SupplierSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    contactPerson: String,
    supplierEmail: String,
    phone: String,
    address: String,
    taxId: String
}, { _id: false }); // As an example of embedding, or make it a separate collection with _id
const PurchaseOrderSchema = new mongoose_1.Schema({
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
exports.PurchaseOrderModel = (0, mongoose_1.model)('PurchaseOrder', PurchaseOrderSchema);
