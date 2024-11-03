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
    getAllProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    ceateProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
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
    })
};
