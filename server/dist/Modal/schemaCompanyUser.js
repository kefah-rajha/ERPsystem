"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCompanyModel = void 0;
const mongoose_1 = require("mongoose");
const UserCompanySchema = new mongoose_1.Schema({
    userId: { type: String },
    nameComapny: { type: String },
    email: { type: String },
    address: { type: String },
    phone: { type: String, unique: false },
    website: { type: String },
    postCode: { type: String },
    city: { type: String },
    street: { type: String },
});
exports.UserCompanyModel = (0, mongoose_1.model)('Usercompany', UserCompanySchema);
