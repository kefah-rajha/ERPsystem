"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const category_1 = require("../Controller/category");
// router.get("/",auth.getfind)
router.post("/category/createCategory", category_1.category.createCategory);
router.post("/category/UpdateCategory/:id", category_1.category.updateCategory);
router.get("/category/getCategories", category_1.category.getCategories);
router.delete("/category/deleteCategory/:id", category_1.category.deleteCategory);
router.post("/Subcategory/createSubCategory/:id", category_1.category.createSubCategory);
router.get("/Subcategory/getSubCategories/:id", category_1.category.getSubCategories);
router.post("/Subcategory/UpdateSubCategory/:id", category_1.category.updateSubCategory);
router.delete("/subCategory/deleteSubCategory/:parentID/:id", category_1.category.deleteSubCategory);
exports.default = router;
