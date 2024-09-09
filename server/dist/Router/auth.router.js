"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../Controller/auth");
// router.get("/",auth.getfind)
router.post("/SignUp", auth_1.auth.SignUpFun);
router.post("/Login", auth_1.auth.login);
// router.post("/logout",auth.logout);
router.get("/authorization", auth_1.auth.getauth);
// router.get("/logout",auth.logout);
exports.default = router;
