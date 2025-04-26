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
const schemaSupplier_1 = require("../Modal/schemaSupplier");
const mongoose_1 = __importDefault(require("mongoose"));
const schemaPurchaseOrder_1 = require("../Modal/schemaPurchaseOrder");
const purchaseOrderController = {
    getPurchaseOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract purchase order ID from request parameters
            const { id } = req.params;
            console.log(id);
            // Validate ID format
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'Invalid purchase order ID format',
                    success: false,
                });
            }
            // Find purchase order
            // Assuming PurchaseOrderModel has an 'items' field with a 'product' subfield to populate
            const purchaseOrder = yield schemaPurchaseOrder_1.PurchaseOrderModel.findById(id).populate("items.product")
                .lean(); // Convert to plain JavaScript object
            // Check if purchase order exists
            if (!purchaseOrder) {
                return res.status(404).json({
                    message: 'Purchase order not found', // Corrected message
                    success: false,
                });
            }
            // Send successful response
            res.status(200).json({
                purchaseOrder: purchaseOrder, // Changed key to purchaseOrder
                success: true,
                message: 'Purchase order retrieved successfully',
            });
        }
        catch (error) {
            // Enhanced error handling
            console.error('Error in getPurchaseOrder:', error); // Changed function name in log
            // Type the error for better handling
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return res.status(500).json({
                message: 'Server error while retrieving purchase order', // Changed message
                error: errorMessage,
                success: false,
            });
        }
    }),
    getPurchaseOrders: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.query, "query");
        try {
            const { from, to, pageNumber = 1, pageSize = 10 } = req.query;
            // Validate input dates
            if (!from || !to) {
                return res.status(400).json({
                    message: 'Both from and to dates are required as query parameters (e.g., ?from=YYYY-MM-DD&to=YYYY-MM-DD)'
                });
            }
            // Convert string dates to Date objects
            // Using new Date() might be lenient with formats. For stricter validation,
            // consider a dedicated date parsing library or more explicit checks.
            const fromDate = new Date(from);
            const toDate = new Date(to);
            // Validate and parse pagination parameters from the path
            const page = parseInt(pageNumber, 10);
            const limit = parseInt(pageSize, 10);
            // Check if parsing resulted in valid, positive integers
            if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid pageNumber or pageSize. Must be positive integers provided in the URL path.'
                });
            }
            // Optional: Add an upper limit to pageSize to prevent excessively large requests
            const effectiveLimit = Math.min(limit, 100); // Example: max 100 items per page
            // Calculate skip value for pagination
            const skip = (page - 1) * effectiveLimit;
            // Build the query filter object
            const filter = {
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            };
            // Retrieve total count of matching purchase orders
            const totalPurchaseOrders = yield schemaPurchaseOrder_1.PurchaseOrderModel.countDocuments(filter);
            // Retrieve paginated Purchase Orders
            const purchaseOrders = yield schemaPurchaseOrder_1.PurchaseOrderModel.find(filter)
                .sort({ createdAt: -1 }) // Sort by creation date descending (newest first)
                .skip(skip)
                .limit(effectiveLimit)
                .populate("items.product", "name _id price"); // Assuming PurchaseOrderModel structure is similar to SalesOrderModel
            // Calculate total pages
            const totalPages = Math.ceil(totalPurchaseOrders / effectiveLimit);
            // Return paginated results
            res.status(200).json({
                success: true,
                currentPage: page,
                itemsPerPage: effectiveLimit,
                totalPages,
                totalItems: totalPurchaseOrders,
                currentItemCount: purchaseOrders.length, // Number of items returned in the current page
                purchaseOrders // The array of purchase order documents
            });
        }
        catch (error) {
            // Log the error server-side for debugging
            console.error('Error retrieving purchase orders:', error);
            // Send a generic error response to the client
            res.status(500).json({
                success: false,
                message: 'Error retrieving purchase orders',
                // Only send basic error info to the client in production
                error: (error instanceof Error) ? error.message : 'An unknown error occurred'
            });
        }
    }),
    createPurchaseOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            console.log(data.values, "Purchase order data");
            // Create a new purchase order based on the interface and incoming data
            const purchaseOrder = new schemaPurchaseOrder_1.PurchaseOrderModel({
                purchaseOrderNumber: (data === null || data === void 0 ? void 0 : data.values.purchaseOrderNumber) || `PO-${Date.now()}`,
                orderDate: new Date(data === null || data === void 0 ? void 0 : data.values.orderDate),
                expectedDeliveryDate: new Date(data === null || data === void 0 ? void 0 : data.values.expectedDeliveryDate),
                requestedBy: data === null || data === void 0 ? void 0 : data.values.requestedBy,
                supplier: {
                    name: data === null || data === void 0 ? void 0 : data.values.supplier.name,
                    contactPerson: data === null || data === void 0 ? void 0 : data.values.supplier.contactPerson,
                    supplierEmail: data === null || data === void 0 ? void 0 : data.values.supplier.supplierEmail,
                    phone: data === null || data === void 0 ? void 0 : data.values.supplier.phone,
                    address: data === null || data === void 0 ? void 0 : data.values.supplier.address,
                    taxId: data === null || data === void 0 ? void 0 : data.values.supplier.taxId
                },
                shippingAddress: data === null || data === void 0 ? void 0 : data.values.shippingAddress,
                items: data.items.map((item) => ({
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    vat: item.vat,
                    vatAmount: item.vatAmount,
                    totalAmount: item.totalAmount
                })),
                netTotal: data === null || data === void 0 ? void 0 : data.values.netTotal,
                totalVat: data === null || data === void 0 ? void 0 : data.values.totalVat,
                totalAmount: data === null || data === void 0 ? void 0 : data.values.totalAmount,
                status: (data === null || data === void 0 ? void 0 : data.values.status) || "draft",
                notes: data === null || data === void 0 ? void 0 : data.values.notes,
                currency: data === null || data === void 0 ? void 0 : data.values.currency,
                paymentTerm: data === null || data === void 0 ? void 0 : data.values.paymentTerm,
                vatRate: data === null || data === void 0 ? void 0 : data.values.vatRate,
            });
            const savedPurchaseOrder = yield purchaseOrder.save();
            console.log(savedPurchaseOrder);
            if (savedPurchaseOrder) {
                return res.status(200).json({
                    data: savedPurchaseOrder,
                    success: true,
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error instanceof Error ? error.message : "An unknown error occurred",
                success: false,
            });
        }
    }),
    searchSupplier: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchQuery = req.query.name || '';
            // Create a case-insensitive regular expression for name search
            const regex = new RegExp(`^${searchQuery}`, 'i');
            const suppliers = yield schemaSupplier_1.supplierModel.find({
                $expr: {
                    $regexMatch: {
                        input: { $concat: ['$firstName', ' ', '$lastName'] },
                        regex: regex
                    }
                }
            })
                .limit(5)
                .exec();
            console.log(suppliers);
            return res.status(200).json({
                data: suppliers,
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
    updatePurchaseOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = req.body;
            const purchaseOrder = {
                purchaseOrderNumber: (data === null || data === void 0 ? void 0 : data.values.purchaseOrderNumber) || `PO-${Date.now()}`,
                orderDate: new Date(data === null || data === void 0 ? void 0 : data.values.orderDate),
                expectedDeliveryDate: new Date(data === null || data === void 0 ? void 0 : data.values.expectedDeliveryDate),
                requestedBy: data === null || data === void 0 ? void 0 : data.values.requestedBy,
                supplier: {
                    name: data === null || data === void 0 ? void 0 : data.values.supplier.name,
                    contactPerson: data === null || data === void 0 ? void 0 : data.values.supplier.contactPerson,
                    supplierEmail: data === null || data === void 0 ? void 0 : data.values.supplier.supplierEmail,
                    phone: data === null || data === void 0 ? void 0 : data.values.supplier.phone,
                    address: data === null || data === void 0 ? void 0 : data.values.supplier.address,
                    taxId: data === null || data === void 0 ? void 0 : data.values.supplier.taxId
                },
                shippingAddress: data === null || data === void 0 ? void 0 : data.values.shippingAddress,
                items: data.items.map((item) => ({
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    vat: item.vat,
                    vatAmount: item.vatAmount,
                    totalAmount: item.totalAmount
                })),
                netTotal: data === null || data === void 0 ? void 0 : data.values.netTotal,
                totalVat: data === null || data === void 0 ? void 0 : data.values.totalVat,
                totalAmount: data === null || data === void 0 ? void 0 : data.values.totalAmount,
                status: (data === null || data === void 0 ? void 0 : data.values.status) || "draft",
                notes: data === null || data === void 0 ? void 0 : data.values.notes,
                currency: data === null || data === void 0 ? void 0 : data.values.currency,
                paymentTerm: data === null || data === void 0 ? void 0 : data.values.paymentTerm,
                vatRate: data === null || data === void 0 ? void 0 : data.values.vatRate,
            };
            const UpdateData = yield schemaPurchaseOrder_1.PurchaseOrderModel.findByIdAndUpdate(id, purchaseOrder, { new: true });
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
    deletePurchaseOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const saleOrderDelete = yield schemaPurchaseOrder_1.PurchaseOrderModel.findByIdAndDelete(id);
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
};
exports.default = purchaseOrderController;
