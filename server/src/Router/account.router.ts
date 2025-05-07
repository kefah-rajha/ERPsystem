import express, { Express, Request, Response } from "express";

const router =express.Router()
import { account } from "../Controller/account";
router.post("/account/createAccount",account.createAccount);
 router.get("/account/getAccounts",account.getAccounts);
// router.get("/getAccount/:id",account.getAccount);
 router.post("/account/updateAccount/:id",account.updateAccount);
router.delete("/account/deleteAccount/:id",account.deleteAccount);
// router.get("/getNumberAccounts",account.getNumberAccounts)
export default router