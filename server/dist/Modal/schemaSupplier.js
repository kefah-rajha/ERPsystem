"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierModel = void 0;
const mongoose_1 = require("mongoose");
const supplierSchema = new mongoose_1.Schema({
    createdAt: { type: Date, default: new Date() },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    website: { type: String },
    companyName: { type: String },
    defaultTax: { type: String },
    phone: { type: String },
    mailingAddress: { type: String },
    postCodeMiling: { type: String },
    cityMiling: { type: String },
    streetMiling: { type: String },
    mailingCountry: { type: String },
    address: { type: String },
    postCode: { type: String },
    city: { type: String },
    street: { type: String },
});
exports.supplierModel = (0, mongoose_1.model)('Supplier', supplierSchema);
