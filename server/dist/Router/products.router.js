"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const products_1 = require("../Controller/products");
router.get("/products/getProducts/:pageNumber", products_1.products.getAllProducts);
//  router.get("/getProduct/:id",products.getProduct)
router.post("/products/createProduct", products_1.products.createProduct);
router.post("/products/updateProduct/:id", products_1.products.updateProduct);
router.get("/products/getProduct/:id", products_1.products.getProduct);
// router.post("/updateProduct",auth.logout);
router.delete("/products/deleteProduct/:id", products_1.products.deleteProduct);
// router.get("/logout",auth.logout);
exports.default = router;
