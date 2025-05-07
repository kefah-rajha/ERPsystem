"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const account_1 = require("../Controller/account");
router.post("account/createAccount", account_1.account.createAccount);
router.get("/getAccounts", account_1.account.getAccounts);
// router.get("/getAccount/:id",account.getAccount);
// router.post("/updateAccount/:id",account.updateAccount);
// router.delete("/deleteAccount/:id",account.deleteAccount);
// router.get("/getNumberAccounts",account.getNumberAccounts)
exports.default = router;
