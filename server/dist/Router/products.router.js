"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const products_1 = require("../Controller/products");
//  router.get("/getProduct/:id",products.getProduct)
router.post("/products/createProduct", products_1.products.ceateProduct);
// router.post("/updateProduct",auth.logout);
//  router.delete("/deleteProduct/:id",products.deleteProduct);
// router.get("/logout",auth.logout);
exports.default = router;
