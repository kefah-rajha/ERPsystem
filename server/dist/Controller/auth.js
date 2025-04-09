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
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_1 = require("../utils/jwt");
dotenv_1.default.config();
const sendRefreshTokenCookie = (res, refreshToken) => {
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('jid', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: maxAge
    });
};
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
                const finalUser = new schemaUser_1.UserModel({
                    userName: newusername,
                    password,
                    name: "",
                    Brithday: ""
                });
                console.log(finalUser, "finalUser");
                const userInfo = yield finalUser.save();
                if (!userInfo) {
                    return res.status(400).json({
                        success: false,
                        message: "uh, there is thing, try later",
                    });
                }
                const userJWT = {
                    _id: userInfo._id.toString(),
                    userName: userInfo.userName,
                    role: userInfo.role
                };
                const accessToken = (0, jwt_1.generateAccessToken)(userJWT);
                const refreshToken = (0, jwt_1.generateRefreshToken)(userJWT);
                yield schemaUser_1.UserModel.updateOne({ _id: userInfo._id }, { $set: { refreshToken: refreshToken } });
                sendRefreshTokenCookie(res, refreshToken);
                return res.status(200).json({
                    refreshToken,
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
                const userJWT = {
                    _id: user_name._id.toString(),
                    userName: user_name.userName,
                    role: user_name.role
                };
                const accessToken = (0, jwt_1.generateAccessToken)(userJWT);
                const refreshToken = (0, jwt_1.generateRefreshToken)(userJWT);
                yield schemaUser_1.UserModel.updateOne({ _id: user_name._id }, { $set: { refreshToken: refreshToken } });
                sendRefreshTokenCookie(res, refreshToken);
                return res.status(200).json({
                    refreshToken,
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
    // i am working on this
    getauth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.cookies.jid;
        if (!token) {
            return res.status(401).json({ accessToken: '', message: 'No refresh token cookie' });
        }
        let payload = null;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(token);
        }
        catch (err) {
            console.error("Refresh Token Verification Error:", err);
            return res.status(401).json({ accessToken: '', message: 'Invalid refresh token' });
        }
        if (!payload || !payload.userId) {
            return res.status(401).json({ accessToken: '', message: 'Invalid refresh token payload' });
        }
        const user = yield schemaUser_1.UserModel.findById(payload.userId).select('+refreshToken');
        if (!user || user.refreshToken !== token) {
            res.clearCookie('jid', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
            return res.status(401).json({ accessToken: '', message: 'Refresh token mismatch or user not found' });
        }
        const userJWT = {
            _id: user._id.toString(),
            userName: user.userName,
            role: user.role
        };
        const newAccessToken = (0, jwt_1.generateAccessToken)(userJWT);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(userJWT);
        user.refreshToken = newRefreshToken;
        const userAfterSaveToken = yield user.save();
        console.log(userAfterSaveToken, "userAfterSaveToken");
        sendRefreshTokenCookie(res, newRefreshToken);
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: userAfterSaveToken
        });
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }
        try {
            yield schemaUser_1.UserModel.updateOne({ _id: userId }, { $unset: { refreshToken: "" } });
            res.clearCookie('jid', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return res.status(200).json({ message: 'Logout successful' });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
};
