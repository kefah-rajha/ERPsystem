"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accounModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const salesOrderSchema = new mongoose_1.default.Schema({
    _id: { type: String },
    orderNumber: { type: String },
    amount: { type: Number },
    status: { type: String },
});
const purchaseOrderSchema = new mongoose_1.default.Schema({
    _id: { type: String },
    orderNumber: { type: String },
    amount: { type: Number },
    status: { type: String },
});
const accountSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    withdrawals: {
        type: Number,
        default: 0,
    },
    deposits: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    completedOperations: {
        type: Number,
        default: 0,
    },
    pendingOperations: {
        type: Number,
        default: 0,
    },
    remainingOperationsValue: {
        type: Number,
        default: 0,
    },
    creator: {
        type: String,
        required: true,
        trim: true,
    },
    initalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    salesOrder: [salesOrderSchema],
    purchaseOrder: [purchaseOrderSchema],
});
exports.accounModel = mongoose_1.default.model('Account', accountSchema);
