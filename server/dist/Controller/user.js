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
exports.user = void 0;
const schemaUserDetails_1 = require("../Modal/schemaUserDetails");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.user = {
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.cookies;
            console.log(token);
            return res.status(200).json({
                success: true,
            });
            const { userId, name, phone, brithday, languag } = req.body;
            const user_id = yield schemaUserDetails_1.UserDetailsModel.findOne({ userId });
            if (!user_id) {
                return res.status(400).json({ err: "the user is not exist" });
            }
            else {
                const updateData = req.body;
                const userAfterUpdat = yield schemaUserDetails_1.UserDetailsModel.findOneAndUpdate({ userId }, updateData, { new: true }); // Return updated user
                return res.status(200).json({
                    userAfterUpdat,
                    success: true,
                });
            }
        }
        catch (error) {
            res.status(402).json(error.message);
        }
    })
};
