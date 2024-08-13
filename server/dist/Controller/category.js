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
const schemaCategory_1 = require("../Modal/schemaCategory");
const category = {
    getAllCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const resallPost = yield schemaCategory_1.CategoryModel.find().sort({
                createdAt: -1
            });
            res.status(200).json({
                allposts: resallPost
            });
        }
        catch (error) {
            console.log(error);
        }
    }),
    postCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description, price, stock, images, attributes } = req.body;
        let photoURLs = [];
        res.status(200).json({ success: true });
    }),
    updateCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, name } = req.body;
        const userUpdate = yield schemaCategory_1.CategoryModel.findByIdAndUpdate(id, { name }, { upsert: true, new: true });
    }),
    deleteCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            const userUpdate = yield schemaCategory_1.CategoryModel.findByIdAndDelete(id);
            res.status(200).json({
                message: "ok"
            });
        }
        catch (err) {
            console.log(err);
        }
    })
};
