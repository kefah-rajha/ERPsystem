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
    getSaleOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract product ID from request parameters
            const { id } = req.params;
            console.log(id);
            // Validate ID format
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'Invalid saleOrder ID format',
                    success: false,
                });
            }
            // Find saleOrder 
            const saleOrder = yield schemaSalesOrder_1.SalesOrderModel.findById(id)
                .lean(); // Convert to plain JavaScript object
            // Check if saleOrder exists
            if (!saleOrder) {
                return res.status(404).json({
                    message: 'Product not found',
                    success: false,
                });
            }
            // Send successful response
            res.status(200).json({
                posts: saleOrder,
                success: true,
                message: 'saleOrder retrieved successfully',
            });
        }
        catch (error) {
            // Enhanced error handling
            console.error('Error in getProduct:', error);
            // Type the error for better handling
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return res.status(500).json({
                message: 'Server error while retrieving saleOrder',
                error: errorMessage,
                success: false,
            });
        }
    }),
    searchCustomer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchQuery = req.query.name || '';
            const regex = new RegExp(`^${searchQuery}`, 'i');
            const customers = yield schemaUser_1.UserModel.find({
                userName: regex,
                role: 'Customer' // Only search users with customer role
            })
                .populate('contactID')
                .limit(5);
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
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $concat: ['$firstName', ' ', '$lastName'] },
                                    regex: new RegExp(regex, 'i')
                                }
                            }
                        }
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
            console.log(data, "data?.values");
            const order = new schemaSalesOrder_1.SalesOrderModel({
                orderNumber: `SO-${Date.now()}`,
                customer: {
                    userName: data === null || data === void 0 ? void 0 : data.values.customer,
                    shipmentAddress: data === null || data === void 0 ? void 0 : data.values.shipmentAddress,
                    phone: data === null || data === void 0 ? void 0 : data.values.phone,
                    customerEmail: data === null || data === void 0 ? void 0 : data.values.customerEmail
                },
                supplier: {
                    name: data === null || data === void 0 ? void 0 : data.values.supplier
                },
                items: data.items,
                salesManager: data === null || data === void 0 ? void 0 : data.values.salesManager,
                shipmentDate: new Date(data === null || data === void 0 ? void 0 : data.values.shipmentDate),
                netTotal: data === null || data === void 0 ? void 0 : data.values.netAmount,
                totalVat: data === null || data === void 0 ? void 0 : data.values.vatAmount,
                totalAmount: data === null || data === void 0 ? void 0 : data.values.totalAmount,
                vatRate: data === null || data === void 0 ? void 0 : data.values.vatRate,
                includeVat: data === null || data === void 0 ? void 0 : data.values.includeVat,
                currency: data === null || data === void 0 ? void 0 : data.values.currency,
                paymentTerm: data === null || data === void 0 ? void 0 : data.values.paymentTerm
            });
            const saveOrder = yield order.save();
            console.log(saveOrder);
            if (saveOrder) {
                return res.status(200).json({
                    data: saveOrder,
                    success: true,
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error,
                success: false,
            });
        }
    }),
    getSalesOrders: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { from, to, page = 1, limit = 10 } = req.query;
            console.log(from, to, page, limit);
            // Validate input dates
            if (!from || !to) {
                return res.status(400).json({
                    message: 'Both from and to dates are required'
                });
            }
            // Convert string dates to Date objects
            const fromDate = new Date(from);
            const toDate = new Date(to);
            // Calculate skip value for pagination
            const skip = (page - 1) * limit;
            // Retrieve total count of orders
            const totalOrders = yield schemaSalesOrder_1.SalesOrderModel.countDocuments({
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            });
            // Retrieve paginated Sales Orders
            const salesOrders = yield schemaSalesOrder_1.SalesOrderModel.find({
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate("items.product", "name _id price");
            // Calculate total pages
            const totalPages = Math.ceil(totalOrders / limit);
            // Return paginated results
            res.status(200).json({
                page: Number(page),
                totalPages,
                totalOrders,
                ordersCount: salesOrders.length,
                salesOrders
            });
        }
        catch (error) {
            res.status(500).json({
                message: 'Error retrieving sales orders',
                error: error
            });
        }
    }),
    deleteSalesOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const saleOrderDelete = yield schemaSalesOrder_1.SalesOrderModel.findByIdAndDelete(id);
            console.log(saleOrderDelete);
            if (saleOrderDelete === null || saleOrderDelete === void 0 ? void 0 : saleOrderDelete._id) {
                res.status(200).json({
                    message: "delete sales order is done",
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
    UpdateSaleOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = req.body;
            const dataSaleOrder = {
                orderNumber: `SO-${Date.now()}`,
                customer: {
                    userName: data === null || data === void 0 ? void 0 : data.values.customer,
                    shipmentAddress: data === null || data === void 0 ? void 0 : data.values.shipmentAddress,
                    phone: data === null || data === void 0 ? void 0 : data.values.phone,
                    customerEmail: data === null || data === void 0 ? void 0 : data.values.customerEmail
                },
                supplier: {
                    name: data === null || data === void 0 ? void 0 : data.values.supplier
                },
                items: data.items,
                salesManager: data === null || data === void 0 ? void 0 : data.values.salesManager,
                shipmentDate: new Date(data === null || data === void 0 ? void 0 : data.values.shipmentDate),
                netTotal: data === null || data === void 0 ? void 0 : data.values.netAmount,
                totalVat: data === null || data === void 0 ? void 0 : data.values.vatAmount,
                totalAmount: data === null || data === void 0 ? void 0 : data.values.totalAmount,
                vatRate: new Date(data === null || data === void 0 ? void 0 : data.values.vatRate),
                includeVat: data === null || data === void 0 ? void 0 : data.values.includeVat,
                currency: data === null || data === void 0 ? void 0 : data.values.currency,
                paymentTerm: data === null || data === void 0 ? void 0 : data.values.paymentTerm
            };
            const UpdateData = yield schemaSalesOrder_1.SalesOrderModel.findByIdAndUpdate(id, dataSaleOrder, { new: true });
            console.log(UpdateData, "update");
            res.status(200).json({
                posts: UpdateData,
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
};
exports.default = salesOrder;
