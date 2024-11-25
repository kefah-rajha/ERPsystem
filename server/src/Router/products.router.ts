import express, { Express, Request, Response } from "express";

const router =express.Router()
import { products } from "../Controller/products";

router.get("/products/getProducts/:pageNumber",products.getAllProducts)

//  router.get("/getProduct/:id",products.getProduct)
 router.post("/products/createProduct",products.createProduct);
 router.post("/products/updateProduct/:id",products.updateProduct);
 router.get("/products/getProduct/:id",products.getProduct)
// router.post("/updateProduct",auth.logout);
router.delete("/products/deleteProduct/:id",products.deleteProduct);
// router.get("/logout",auth.logout);


export default router