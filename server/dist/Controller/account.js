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
            console.log("test");
            const resAllBankAccount = yield schemaAccounting_1.accounModel.find();
            return res.status(200).json({
                data: resAllBankAccount,
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
                initalAmount: amount,
                amount: 0,
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
    }),
    // Update account
    updateAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, amount } = req.body;
            const account = yield schemaAccounting_1.accounModel.findById(req.params.id);
            if (!account) {
                return res.status(404).json({ message: 'Account not found',
                    success: false,
                });
            }
            // Update deposits or withdrawals based on amount change
            if (amount !== undefined && amount !== account.amount) {
                if (amount > account.amount) {
                    account.deposits += 1;
                }
                else if (amount < account.amount) {
                    account.withdrawals += 1;
                }
            }
            // Update account fields
            if (name)
                account.name = name;
            if (amount !== undefined)
                account.amount = amount;
            const updatedAccount = yield account.save();
            return res.status(400).json({
                message: updatedAccount,
                success: true,
            });
        }
        catch (error) {
            console.error('Error updating account:', error);
            return res.status(400).json({
                message: error,
                success: false,
            });
        }
    }),
    deleteAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deletedAccount = yield schemaAccounting_1.accounModel.findByIdAndDelete(id);
            if (!deletedAccount) {
                return res.status(400).json({
                    message: 'Account not found',
                    success: false,
                });
            }
            return res.status(400).json({
                success: true,
            });
        }
        catch (error) {
            console.error('Error deleting account:', error);
            return res.status(400).json({
                message: error,
                success: false,
            });
        }
    })
};
