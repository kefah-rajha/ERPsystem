"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dashboard_1 = require("../Controller/dashboard");
// router.get("/",auth.getfind)
router.post("/gerenrationImage", dashboard_1.dashboard.gerneratioImage);
// router.post("/Login",auth.login);
// router.post("/logout",auth.logout);
// router.get("/authorization",auth.getauth);
// router.get("/logout",auth.logout);
exports.default = router;
