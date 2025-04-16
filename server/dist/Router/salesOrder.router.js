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
router.post('/createSaleOrder', salesOrder_1.default.createSalesOrder);
router.get('/getSalesOrders', salesOrder_1.default.getSalesOrders);
router.delete("/deleteSalesOrder/:id", salesOrder_1.default.deleteSalesOrder);
router.get("/getSaleOrder/:id", salesOrder_1.default.getSaleOrder);
router.post("/updateSaleOrder/:id", salesOrder_1.default.UpdateSaleOrder);
exports.default = router;
