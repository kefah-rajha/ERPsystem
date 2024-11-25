import express, { Express, Request, Response } from "express";
import salesOrder from "../Controller/salesOrder"


const router =express.Router()

router.get('/searchCustomer',salesOrder.searchCustomer)
router.get('/searchSupplier',salesOrder.searchSupplier)
router.post('/searchProductSalesOrder',salesOrder.searchProductSalesOrder)



export default router
