import express, { Express, Request, Response } from "express";

const router =express.Router()
import { products } from "../Controller/products";

router.post("/products/getProducts/:pageNumber/:pageSize",products.getAllProducts)

//  router.get("/getProduct/:id",products.getProduct)
 router.post("/products/createProduct",products.createProduct);
 router.post("/products/updateProduct/:id",products.updateProduct);
 router.get("/products/getProduct/:id",products.getProduct)
// router.post("/updateProduct",auth.logout);
router.delete("/products/deleteProduct/:id",products.deleteProduct);
// router.get("/logout",auth.logout);
router.get("/products/getNumberProducts",products.getNumberProducts)

export default router