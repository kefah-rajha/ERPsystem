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
Object.defineProperty(exports, "__esModule", { value: true });
exports.account = void 0;
const schemaAccounting_1 = require("../Modal/schemaAccounting");
exports.account = {
    getAccounts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const resAllCategory = yield schemaAccounting_1.accounModel.find();
            return res.status(200).json({
                data: resAllCategory,
                success: true,
            });
        }
        catch (error) {
            return res.status(400).json({
                message: error,
                success: false,
            });
        }
    }),
    createAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, amount, creator = 'John Doe' } = req.body;
            if (!name || amount === undefined) {
                return res.status(400).json({ message: 'Name and amount are required' });
            }
            const newAccount = new schemaAccounting_1.accounModel({
                name,
                amount,
                creator
            });
            const savedAccount = yield newAccount.save();
            console.log(savedAccount, "savedAccount");
            return res.status(200).json({
                success: true,
                data: savedAccount
            });
        }
        catch (error) {
            console.error('Error creating account:', error);
            return res.status(500).json({
                success: false,
                message: `Error fetching categories:${error}`
            });
        }
    })
};
