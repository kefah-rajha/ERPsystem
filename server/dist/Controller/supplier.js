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
exports.supplier = void 0;
const schemaSupplier_1 = require("../Modal/schemaSupplier");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.supplier = {
    getAllSupplier: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { pageNumber } = req.params;
            console.log(pageNumber);
            const { fieldSort, sort, fields, fieldSearch, searchInput } = req.body;
            const sortAsNumber = sort == "1" ? 1 : -1;
            const regex = searchInput == "" ? new RegExp(/^[a-zA-Z0-9]+$/) : new RegExp(`^${searchInput}`, 'i');
            console.log(regex, "regex");
            const search = {
                $match: {
                    [fieldSearch]: { $regex: regex }
                }
            };
            const SortAlphaB = {
                $sort: {
                    [fieldSort]: sortAsNumber
                }
            };
            const EmptyFields = {
                $match: {
                    $or: [
                        { "lastName": "" },
                        { "firstName": "" },
                        { "email": "" },
                        { "companyName": "" },
                        { "phone": "" },
                        { "address": "" },
                    ]
                }
            };
            const pipeline = [];
            if (fields !== "Empty") {
                const recallPost = yield schemaSupplier_1.supplierModel.aggregate([...pipeline, search, SortAlphaB]);
                console.log(recallPost);
                return res.status(200).json({
                    data: recallPost,
                    success: true,
                });
            }
            else if (fields == "Empty") {
                const recallPost = yield schemaSupplier_1.supplierModel.aggregate([...pipeline, search, EmptyFields,
                    SortAlphaB
                ]);
                return res.status(200).json({
                    data: recallPost,
                    success: true,
                });
            }
        }
        catch (error) {
            return res.status(200).json({
                message: error,
                success: true,
            });
        }
    }),
    createSupplier: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { firstName, lastName, email, website, companyName, defaultTax, phone, mailingAddress, postCodeMiling, cityMiling, streetMiling, mailingCountry, address, postCode, city, street, country } = req.body;
            const supplierEmail = yield schemaSupplier_1.supplierModel.findOne({ email: email });
            if (supplierEmail) {
                return res.status(400).json({
                    success: false,
                    message: "The supplier's Email Is Exist ,Choose A Unique Email",
                });
            }
            else {
                const finalSupplier = new schemaSupplier_1.supplierModel({
                    firstName,
                    lastName,
                    email,
                    website,
                    companyName,
                    defaultTax,
                    phone,
                    mailingAddress,
                    postCodeMiling,
                    cityMiling,
                    streetMiling,
                    mailingCountry,
                    address,
                    postCode,
                    city,
                    street,
                    country
                });
                console.log(finalSupplier, "finaluser");
                const supplierInfo = yield finalSupplier.save();
                if (!supplierInfo) {
                    return res.status(400).json({
                        success: false,
                        message: "uh, there is thing, try later",
                    });
                }
                return res.status(200).json({
                    data: supplierInfo,
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
    updateSupplier: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("update");
            const { id } = req.params;
            const data = req.body;
            const UpdateData = yield schemaSupplier_1.supplierModel.findByIdAndUpdate(id, data, { new: true });
            return res.status(200).json({
                data: UpdateData,
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
    deleteSupplier: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const supplierDelete = yield schemaSupplier_1.supplierModel.findByIdAndDelete(id);
            console.log(supplierDelete);
            if (supplierDelete === null || supplierDelete === void 0 ? void 0 : supplierDelete._id) {
                res.status(200).json({
                    message: "delete supplier is done",
                    success: true,
                });
            }
            else {
                res.status(402).json({
                    message: "delete user is falid",
                    success: false,
                });
            }
        }
        catch (error) {
            res.status(402).json({
                message: error,
                success: false,
            });
        }
    }),
};
