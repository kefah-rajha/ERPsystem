"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    Brithday: { type: String },
    role: { type: String, default: "Customer" },
    createdAt: { type: Date, default: new Date() },
    companyID: { type: mongoose_1.Schema.Types.ObjectId, ref: "Usercompany" },
    contactID: { type: mongoose_1.Schema.Types.ObjectId, ref: "contactInfo" },
});
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
