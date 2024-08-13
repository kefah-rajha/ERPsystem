import express, { Express, Request, Response } from "express";

const router =express.Router()
import { user } from "../Controller/user";
// router.get("/",auth.getfind)
router.post("/updateuser",user.updateUser);
// router.post("/Login",auth.login);
// router.post("/logout",auth.logout);
// router.get("/authorization",auth.getauth);
// router.get("/logout",auth.logout);


export default router