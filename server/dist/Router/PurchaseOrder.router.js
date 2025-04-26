"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Importing the Controller functions for purchase orders
// Ensure the path is correct for your controller file
const purchaseOrder_1 = __importDefault(require("../Controller/purchaseOrder")); // Example path
const router = express_1.default.Router();
router.get('/purchaseOrder/searchSupplier', purchaseOrder_1.default.searchSupplier); // To search for external suppliers
// Route to search for products in the context of a purchase order
// POST /api/purchase-orders/searchProductPurchaseOrder
// You might use POST if the search criteria are complex and sent in the body
// router.post('/searchProductPurchaseOrder', purchaseOrderController.searchProductPurchaseOrder);
// --- CRUD operation routes for purchase orders ---
router.post('/purchaseOrder/createPurchaseOrder', purchaseOrder_1.default.createPurchaseOrder);
router.get('/purchaseOrder/getPurchaseOrders', purchaseOrder_1.default.getPurchaseOrders);
router.get('/getPurchaseOrder/:id', purchaseOrder_1.default.getPurchaseOrder);
router.delete("/deletePurchaseOrder/:id", purchaseOrder_1.default.deletePurchaseOrder);
// Route to get the details of a single purchase order by ID
// GET /api/purchase-orders/getPurchaseOrder/60d5ecb8b49aa834c4a7f8b1
// router.get("/getPurchaseOrder/:id", purchaseOrderController.getPurchaseOrder);
router.post("/updatePurchaseOrder/:id", purchaseOrder_1.default.updatePurchaseOrder); // You can also use PUT or PATCH
// Make sure to export the router for use in the main application file (app.ts or server.ts)
exports.default = router;
// In the main application file (e.g., app.ts):
// import purchaseOrderRoutes from './routes/purchaseOrderRoutes'; // Adjust the path
// app.use('/api/purchase-orders', purchaseOrderRoutes); // Define the base path for this group of routes
