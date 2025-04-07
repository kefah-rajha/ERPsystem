import express, { Express, Request, Response } from "express";

const router =express.Router()
import { auth } from "../Controller/auth";
// router.get("/",auth.getfind)
router.post("/SignUp",auth.SignUpFun);
router.post("/Login",auth.login);
// router.post("/logout",auth.logout);
 router.post("/authorization",auth.getauth);
 router.get("/logout",auth.logout);


export default router