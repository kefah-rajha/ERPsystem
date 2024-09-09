"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../Controller/user");
// router.get("/",auth.getfind)
router.get("/getUsers/:pageNumber", user_1.user.getAllUsers);
router.post("/profile/profileInfo/:id", user_1.user.updateUser);
router.get("/profile/profileInfo/:id", user_1.user.getProfileInfoUser);
router.post("/profile/contactInfo/:id", user_1.user.updateContactInfoUser);
router.get("/profile/contactInfo/:id", user_1.user.getContactInfoUser);
router.post("/profile/companyInfo/:id", user_1.user.updatecompanyInfoUser);
router.get("/profile/companyInfo/:id", user_1.user.getCompanyInfo);
router.post("/importUsers", user_1.user.ImportUser);
router.get("/getNumberUsers", user_1.user.getNumberUsers);
router.post("/createUser", user_1.user.createUsers);
router.delete("/deleteUser/:id", user_1.user.deleteUser);
// router.post("/",auth.login);
// router.post("/logout",auth.logout);
// router.get("/authorization",auth.getauth);
// router.get("/logout",auth.logout);
exports.default = router;
