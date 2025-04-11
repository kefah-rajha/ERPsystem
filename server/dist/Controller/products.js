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
exports.products = void 0;
const schemaProducts_1 = require("../Modal/schemaProducts");
const mongoose_1 = __importDefault(require("mongoose"));
exports.products = {
    getProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract product ID from request parameters
            const { id } = req.params;
            // Validate ID format
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'Invalid product ID format',
                    success: false,
                });
            }
            // Find product and populate categories and subcategories
            const product = yield schemaProducts_1.ProductModel.findById(id)
                .populate('categories') // Populate main category
                .populate('subCategories') // Populate subcategories
                .lean(); // Convert to plain JavaScript object
            console.log(product, "product");
            // Check if product exists
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found',
                    success: false,
                });
            }
            // Send successful response
            res.status(200).json({
                product: product,
                success: true,
                message: 'Product retrieved successfully',
            });
        }
        catch (error) {
            // Enhanced error handling
            console.error('Error in getProduct:', error);
            // Type the error for better handling
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return res.status(500).json({
                message: 'Server error while retrieving product',
                error: errorMessage,
                success: false,
            });
        }
    }),
    getAllProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("test");
        try {
            const pageNumber = parseInt(req.params.pageNumber) || 1;
            const pageSize = parseInt(req.params.pageSize) || 10;
            const skipItems = (pageNumber - 1) * pageSize;
            const { fieldSort, sort, fields, fieldSearch, searchInput, selectedBrands, selectedCategory, supplierName, inStock, priceRange, dateRange } = req.body;
            // Build filter query
            const query = {};
            if (searchInput) {
                if (fieldSearch) {
                    // If specific field is provided, search only in that field
                    query[fieldSearch] = { $regex: searchInput, $options: 'i' };
                }
                else {
                    // If no field is specified, default to searching by name only
                    query.name = { $regex: searchInput, $options: 'i' };
                }
            }
            console.log(inStock == false, "inStock");
            if (inStock == "true") {
                // Get products with stock greater than 0
                console.log(true, "inStock");
                query.stock = { $gt: 0 };
            }
            if (inStock == "false") {
                // Get products with stock equal to 0
                console.log(false, "inStock");
                query.stock = 0;
            }
            if (selectedBrands !== "All") {
                // Get products with stock greater than 0
                query.brandName = selectedBrands;
            }
            if (selectedCategory !== null) {
                query.$or = [
                    { categories: selectedCategory },
                    { subCategories: selectedCategory }
                ];
            }
            // Price range filter
            if (priceRange.min || priceRange.max) {
                query.price = {};
                if (priceRange.min)
                    query.price.$gte = parseFloat(priceRange.min);
                if (priceRange.max)
                    query.price.$lte = parseFloat(priceRange.max);
            }
            // Creation date filter
            if (dateRange.startDate || dateRange.endDate) {
                query.createdAt = {};
                if (dateRange.startDate) {
                    query.createdAt.$gte = new Date(dateRange.startDate);
                }
                if (dateRange.endDate) {
                    query.createdAt.$lte = new Date(dateRange.endDate);
                }
            }
            // Apply sorting
            const sortOptions = {};
            sortOptions[fieldSort] = sort === 'asc' ? 1 : -1;
            console.log(query);
            // Get products
            const products = yield schemaProducts_1.ProductModel
                .find(query)
                .sort(sortOptions)
                .skip(skipItems)
                .limit(pageSize);
            console.log(query);
            const priceStats = yield schemaProducts_1.ProductModel.aggregate([
                {
                    $group: {
                        _id: null,
                        minPrice: { $min: { $toDouble: "$price" } },
                        maxPrice: { $max: { $toDouble: "$price" } }
                    }
                }
            ]);
            const suppliers = yield schemaProducts_1.ProductModel.distinct('SupplierName');
            const brand = yield schemaProducts_1.ProductModel.distinct('brandName');
            console.log(suppliers);
            // Send response
            res.status(200).json({
                success: true,
                data: {
                    products,
                    appliedFilters: {
                        priceStats,
                        suppliers,
                        brand,
                        // maxPrice,
                        // searchTerm
                    }
                }
            });
        }
        catch (error) {
            return res.status(400).json({
                message: error,
                success: false,
            });
        }
    }),
    createProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            console.log(data, "data");
            if (data.price) {
                data.price = parseFloat(data.price);
            }
            const newProduct = new schemaProducts_1.ProductModel(data);
            yield newProduct.save();
            return res.status(200).json({
                data: data,
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
    deleteProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(id);
            const productDelete = yield schemaProducts_1.ProductModel.findByIdAndDelete(id);
            console.log(productDelete);
            res.status(200).json({
                ID: productDelete === null || productDelete === void 0 ? void 0 : productDelete._id,
                message: "ok"
            });
        }
        catch (err) {
            console.log(err);
        }
    }),
    updateProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("update");
            const data = req.body;
            const UpdateData = yield schemaProducts_1.ProductModel.findByIdAndUpdate(data.id, data, { new: true });
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
    getNumberProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const totalCount = yield schemaProducts_1.ProductModel.countDocuments();
            return res.status(200).json({
                data: totalCount,
                success: true,
            });
        }
        catch (error) {
            return res.status(400).json({
                message: error,
                success: false,
            });
        }
    })
};
