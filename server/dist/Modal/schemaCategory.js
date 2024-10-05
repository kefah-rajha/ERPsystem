"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    children: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Category',
        }],
});
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
