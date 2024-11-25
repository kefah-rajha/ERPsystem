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
const schemaUser_1 = require("../Modal/schemaUser");
const schemaSupplier_1 = require("../Modal/schemaSupplier");
const schemaProducts_1 = require("../Modal/schemaProducts");
const mongoose_1 = __importDefault(require("mongoose"));
const schemaSalesOrder_1 = require("../Modal/schemaSalesOrder");
const salesOrder = {
    searchCustomer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchQuery = req.query.name || '';
            const regex = new RegExp(`^${searchQuery}`, 'i');
            const customers = yield schemaUser_1.UserModel.find({
                userName: regex,
                role: 'Customer' // Only search users with customer role
            })
                .populate("phone")
                .limit(5)
                .exec();
            console.log(customers);
            return res.status(200).json({
                data: customers,
                success: true,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error,
                success: false,
            });
        }
    }),
    searchSupplier: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchQuery = req.query.name || '';
            // Create a case-insensitive regular expression for name search
            const regex = new RegExp(`^${searchQuery}`, 'i');
            const SearchQueries = [
                {
                    $or: [
                        { $expr: {
                                $regexMatch: {
                                    input: { $concat: ['$firstName', ' ', '$lastName'] },
                                    regex: new RegExp(regex, 'i')
                                }
                            } }
                    ]
                }
            ];
            const supplier = yield schemaSupplier_1.supplierModel.find({
                $or: SearchQueries
            })
                .select('firstName lastName')
                .limit(5)
                .exec();
            console.log(supplier);
            return res.status(200).json({
                data: supplier,
                success: true,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error,
                success: false,
            });
        }
    }),
    searchProductSalesOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { fieldSearch, searchInput } = req.body;
        const searchQuery = {
            [fieldSearch]: {
                $regex: new RegExp(searchInput, 'i')
            }
        };
        console.log(searchQuery);
        try {
            const products = yield schemaProducts_1.ProductModel.find(searchQuery)
                .limit(5);
            console.log(products);
            return res.status(200).json({
                data: products,
                success: true,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error,
                success: false,
            });
        }
    }),
    createSalesOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            const order = new schemaSalesOrder_1.SalesOrderModel({
                orderNumber: `SO-${Date.now()}`,
                customer: {
                    name: 'John Doe',
                    contact: 'john@example.com',
                    phone: '1234567890'
                },
                salesStaff: {
                    name: 'Jane Smith',
                    code: 'SS001'
                },
                items: [{
                        product: new mongoose_1.default.Types.ObjectId('product_id_here'),
                        quantity: 2,
                        vat: 0.2,
                        vatAmount: 20,
                        totalAmount: 120
                    }],
                subtotal: 100,
                totalVat: 20,
                grandTotal: 120
            });
            const saveOrder = yield order.save();
            if (saveOrder) {
                return res.status(200).json({
                    data: saveOrder,
                    success: true,
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                message: error,
                success: false,
            });
        }
    })
};
exports.default = salesOrder;
