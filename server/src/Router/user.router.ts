import express, { Express, Request, Response } from "express";

const router =express.Router()
import { user } from "../Controller/user";
router.post("/getUsers/:pageNumber",user.getAllUsers)
router.post("/profile/UpdateprofileInfo/:id",user.updateUser);
router.get("/profile/getProfileInfo/:id",user.getProfileInfoUser);
router.post("/profile/contactInfo/:id",user.updateContactInfoUser);
router.get("/profile/contactInfo/:id",user.getContactInfoUser);
 router.post("/profile/companyInfo/:id",user.updatecompanyInfoUser);
 router.get("/profile/companyInfo/:id",user.getCompanyInfo);
 router.post("/importUsers",user.ImportUser);
 router.get("/getNumberUsers",user.getNumberUsers);
 router.post("/createUser",user.createUsers)
 router.delete("/deleteUser/:id",user.deleteUser);
 router.get("/userFilter/",user.userFilter);






 
 


export default router