"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salesOrder_1 = __importDefault(require("../Controller/salesOrder"));
const router = express_1.default.Router();
router.get('/searchCustomer', salesOrder_1.default.searchCustomer);
router.get('/searchSupplier', salesOrder_1.default.searchSupplier);
router.post('/searchProductSalesOrder', salesOrder_1.default.searchProductSalesOrder);
exports.default = router;
