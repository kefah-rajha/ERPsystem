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
            const pageNumber = parseInt(req.params.pageNumber) || 1;
            const pageSize = parseInt(req.params.pageSize) || 10;
            const skipItems = (pageNumber - 1) * pageSize;
            const { fieldSort, sort, fields, fieldSearch, searchInput, dateRange } = req.body;
            console.log(fieldSort, sort, fields, fieldSearch, searchInput);
            // Simple case: no filters applied
            if (fields === "All" && searchInput === "" && sort === "1" &&
                (!dateRange || (dateRange.startDate === "" && dateRange.endDate === ""))) {
                console.log("No filters applied - using simple find");
                const suppliers = yield schemaSupplier_1.supplierModel.find({})
                    .skip(skipItems)
                    .limit(pageSize);
                return res.status(200).json({
                    success: true,
                    data: suppliers,
                    message: 'Suppliers retrieved successfully'
                });
            }
            else {
                // Build the query with filters
                const query = {};
                // Add date range filter if specified
                if (dateRange) {
                    if (dateRange.startDate || dateRange.endDate) {
                        query.createdAt = query.createdAt || {};
                        if (dateRange.startDate) {
                            query.createdAt.$gte = new Date(dateRange.startDate);
                        }
                        else {
                            query.createdAt.$gte = new Date('1970-01-01');
                        }
                        if (dateRange.endDate) {
                            query.createdAt.$lte = new Date(dateRange.endDate);
                        }
                        else {
                            query.createdAt.$lte = new Date();
                        }
                    }
                }
                // Add search filter if search input exists
                if (searchInput) {
                    if (fieldSearch) {
                        // If specific field is provided, search only in that field
                        query[fieldSearch] = { $regex: searchInput, $options: 'i' };
                    }
                    else {
                        // If no field is specified, default to searching by first name
                        query.firstName = { $regex: searchInput, $options: 'i' };
                    }
                }
                // Add empty/non-empty fields filter
                if (fields === "Empty") {
                    query.$or = [
                        { firstName: { $eq: '' } },
                        { lastName: { $eq: '' } },
                        { email: { $eq: '' } },
                        { companyName: { $eq: '' } },
                        { phone: { $eq: '' } },
                        { address: { $eq: '' } },
                    ];
                }
                // Build sort options
                const sortOptions = {};
                if (fieldSort) {
                    sortOptions[fieldSort] = sort === '1' ? 1 : -1;
                }
                console.log("Query:", query);
                console.log("Sort:", sortOptions);
                // Execute query with filters and sorting
                const suppliers = yield schemaSupplier_1.supplierModel
                    .find(query)
                    .sort(sortOptions)
                    .skip(skipItems)
                    .limit(pageSize)
                    .lean();
                return res.status(200).json({
                    success: true,
                    data: suppliers,
                    message: 'Suppliers retrieved successfully'
                });
            }
        }
        catch (error) {
            console.error("Error in getAllSupplier:", error);
            return res.status(500).json({
                message: error instanceof Error ? error.message : "An unknown error occurred",
                success: false,
            });
        }
    }),
    getSupplier: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.id;
        const getDataSupplier = yield schemaSupplier_1.supplierModel.findOne({ _id: userId });
        console.log(getDataSupplier, "getDataUSer");
        if (!getDataSupplier) {
            return res.status(400).json({
                success: false,
            });
        }
        else {
            return res.status(200).json({
                data: getDataSupplier,
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
                console.log(supplierInfo, "supplierInfo");
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
