import express, { Express, Request, Response } from "express";

const router =express.Router()
import { products } from "../Controller/products";


//  router.get("/getProduct/:id",products.getProduct)
 router.post("/products/createProduct",products.ceateProduct);
// router.post("/updateProduct",auth.logout);
//  router.delete("/deleteProduct/:id",products.deleteProduct);
// router.get("/logout",auth.logout);


export default router