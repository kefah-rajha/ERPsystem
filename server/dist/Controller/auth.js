"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const schemaUser_1 = require("../Modal/schemaUser");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.auth = {
    SignUpFun: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { userName, password } = req.body;
            const newusername = userName.toLowerCase().replace(/ /g, "");
            const user_name = yield schemaUser_1.UserModel.findOne({ userName: newusername });
            if (user_name) {
                return res.status(400).json({
                    success: false,
                    message: "The User Name Is Exist ,Choose A Unique Username",
                });
            }
            else {
                const finaluser = new schemaUser_1.UserModel({
                    userName: newusername,
                    password,
                    name: "",
                    Brithday: ""
                });
                console.log(finaluser, "finaluser");
                const userInfo = yield finaluser.save();
                if (!userInfo) {
                    return res.status(400).json({
                        success: false,
                        message: "uh, there is thing, try later",
                    });
                }
                const create_token = createAccessToken({ id: finaluser._id });
                const refreash_token = createRefreashToken({ id: finaluser._id });
                res.cookie("refreash_token", refreash_token, {
                    httpOnly: true,
                    secure: true,
                    SameSite: "none",
                    path: "api/authorization",
                    maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
                });
                return res.status(200).json({
                    refreash_token,
                    success: true,
                });
            }
        }
        catch (error) {
            res.status(402).json({
                message: error.message,
                success: false,
            });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        try {
            const { password, userName } = req.body;
            //make all user name lowerCase
            const newusername = userName.toLowerCase().replace(/ /g, "");
            const user_name = yield schemaUser_1.UserModel.findOne({ userName: newusername });
            if (!user_name) {
                res.status(400).json({
                    success: false,
                    message: "the user name name isnt exist"
                });
            }
            else {
                if (password !== (user_name === null || user_name === void 0 ? void 0 : user_name.password)) {
                    res.status(400).json({
                        success: false,
                        message: "the password isnt True"
                    });
                }
                const create_token = createAccessToken({ id: user_name === null || user_name === void 0 ? void 0 : user_name._id });
                const refreash_token = createRefreashToken({ id: user_name === null || user_name === void 0 ? void 0 : user_name._id });
                res.cookie("refreash_token", refreash_token, {
                    httpOnly: true,
                    secure: true,
                    path: "api/authorization",
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
                });
                return res
                    .status(200)
                    .json({ success: true, user: user_name, refreash_token });
            }
        }
        catch (error) {
            res.status(402).json({
                message: error.message,
                success: false,
            });
        }
    }),
    // i am working on this
    getauth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.cookies.refreash_token;
        const userIdByToken = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const userID = userIdByToken.id;
        const userToken = yield schemaUser_1.UserModel.findById(userID);
        console.log(userToken);
        // const newAccessToken = createAccessToken({ id: userID});
        //   await res.cookie("refreash_token", newAccessToken, {
        //     httpOnly: true,
        //     secure: true,
        //     path: "api/authorization",
        //     maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
        //   });
        return res.status(402).json({
            data: userToken,
            success: true,
        });
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.clearCookie("refreshtoken", { path: "api/authorization" });
            return res.json({ msg: "Logged out!" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
};
const createAccessToken = (paylod) => {
    return jsonwebtoken_1.default.sign(paylod, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10d",
    });
};
const createRefreashToken = (paylod) => {
    console.log(process.env.REFRES_TOKEN_SECRET, process.env.ACCESS_TOKEN_SECRET);
    return jsonwebtoken_1.default.sign(paylod, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};
