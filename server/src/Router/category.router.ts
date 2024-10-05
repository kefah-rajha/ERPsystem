import express, { Express, Request, Response } from "express";

const router =express.Router()
import { category } from "../Controller/category";
// router.get("/",auth.getfind)
router.post("/category/createCategory",category.createCategory);
router.post("/category/UpdateCategory/:id",category.updateCategory);
router.get("/category/getCategories",category.getCategories);
router.delete("/category/deleteCategory/:id",category.deleteCategory);
router.post("/Subcategory/createSubCategory/:id",category.createSubCategory);
router.get("/Subcategory/getSubCategories/:id",category.getSubCategories);
router.post("/Subcategory/UpdateSubCategory/:id",category.updateSubCategory);
router.delete("/subCategory/deleteSubCategory/:parentID/:id",category.deleteSubCategory);







export default router