"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailsModel = void 0;
const mongoose_1 = require("mongoose");
const UserDetailsSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, default: "" },
    brithday: { type: String, default: "" },
});
exports.UserDetailsModel = (0, mongoose_1.model)('UserDetails', UserDetailsSchema);
