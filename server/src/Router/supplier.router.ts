import express, { Express, Request, Response } from "express";

const router =express.Router()
import {  supplier} from "../Controller/supplier";
 router.post("/supplier/getSuppliers/10",supplier.getAllSupplier)
router.post("/supplier/UpdateSupplier/:id",supplier.updateSupplier);
router.get("/supplier/getSupplier/:id",supplier.getSupplier);
// router.post("/profile/contactInfo/:id",user.updateContactInfoUser);
// router.get("/profile/contactInfo/:id",user.getContactInfoUser);
//  router.post("/profile/companyInfo/:id",user.updatecompanyInfoUser);
//  router.get("/profile/companyInfo/:id",user.getCompanyInfo);
//  router.post("/importUsers",user.ImportUser);
//  router.get("/getNumberUsers",user.getNumberUsers);
 router.post("/supplier/createSupplier",supplier.createSupplier)
 router.delete("/deleteSupplier/:id",supplier.deleteSupplier);
//  router.get("/userFilter/",user.userFilter);






 
 


export default router