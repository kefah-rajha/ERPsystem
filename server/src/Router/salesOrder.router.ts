import express, { Express, Request, Response } from "express";
import salesOrder from "../Controller/salesOrder"


const router =express.Router()

router.get('/searchCustomer',salesOrder.searchCustomer)
router.get('/searchSupplier',salesOrder.searchSupplier)
router.post('/searchProductSalesOrder',salesOrder.searchProductSalesOrder)
router.post('/createSaleOrder',salesOrder.createSalesOrder)
router.get('/getSalesOrders',salesOrder.getSalesOrders)
router.delete("/deleteSalesOrder/:id",salesOrder.deleteSalesOrder);
router.get("/getSaleOrder/:id",salesOrder.UpdateSaleOrder);
router.get("/getSaleOrder/:id",salesOrder.UpdateSaleOrder);
router.post("/updateSaleOrder/:id",salesOrder.UpdateSaleOrder);



export default router
