"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailsModel = void 0;
const mongoose_1 = require("mongoose");
const UserDetailsSchema = new mongoose_1.Schema({
    userId: String,
    email: String,
    address: String,
    phone: String,
    website: String,
    postCode: { type: String },
    city: { type: String },
    street: { type: String },
});
exports.UserDetailsModel = (0, mongoose_1.model)('contactInfo', UserDetailsSchema);
