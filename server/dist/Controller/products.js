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
exports.products = void 0;
const schemaProducts_1 = require("../Modal/schemaProducts");
exports.products = {
    getProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(id, "test");
            const resPost = yield schemaProducts_1.ProductModel.findById(id);
            res.status(200).json({
                posts: resPost
            });
        }
        catch (error) {
            console.log(error);
        }
    }),
    getAllProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("test");
        try {
            const { pageNumber } = req.params;
            const resallPost = yield schemaProducts_1.ProductModel.find().sort({
                createdAt: -1
            });
            console.log(resallPost);
            res.status(200).json({
                allposts: resallPost
            });
        }
        catch (error) {
            console.log(error);
        }
    }),
    createProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            console.log(data);
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
};
