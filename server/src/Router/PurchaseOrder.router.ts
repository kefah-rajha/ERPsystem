import express from 'express';
// Importing the Controller functions for purchase orders
// Ensure the path is correct for your controller file
import  purchaseOrderController from '../Controller/purchaseOrder'; // Example path

const router = express.Router();


 router.get('/purchaseOrder/searchSupplier', purchaseOrderController.searchSupplier); // To search for external suppliers

// Route to search for products in the context of a purchase order
// POST /api/purchase-orders/searchProductPurchaseOrder
// You might use POST if the search criteria are complex and sent in the body
// router.post('/searchProductPurchaseOrder', purchaseOrderController.searchProductPurchaseOrder);

// --- CRUD operation routes for purchase orders ---


router.post('/purchaseOrder/createPurchaseOrder', purchaseOrderController.createPurchaseOrder);


router.get('/purchaseOrder/getPurchaseOrders', purchaseOrderController.getPurchaseOrders);
router.get('/getPurchaseOrder/:id', purchaseOrderController.getPurchaseOrder);


router.delete("/deletePurchaseOrder/:id", purchaseOrderController.deletePurchaseOrder);

// Route to get the details of a single purchase order by ID
// GET /api/purchase-orders/getPurchaseOrder/60d5ecb8b49aa834c4a7f8b1
// router.get("/getPurchaseOrder/:id", purchaseOrderController.getPurchaseOrder);

router.post("/updatePurchaseOrder/:id", purchaseOrderController.updatePurchaseOrder); // You can also use PUT or PATCH

// Make sure to export the router for use in the main application file (app.ts or server.ts)
export default router;

// In the main application file (e.g., app.ts):
// import purchaseOrderRoutes from './routes/purchaseOrderRoutes'; // Adjust the path
// app.use('/api/purchase-orders', purchaseOrderRoutes); // Define the base path for this group of routes