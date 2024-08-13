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
            res.status(200).json({
                allposts: resallPost
            });
        }
        catch (error) {
            console.log(error);
        }
    }),
    getProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(id, "test");
            const resPost = yield schemaProducts_1.ProductModel.findById(id).sort({
                createdAt: 1
            });
            res.status(200).json({
                posts: resPost
            });
        }
        catch (error) {
            console.log(error);
        }
    }),
    getNumberProducts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        schemaProducts_1.ProductModel.countDocuments()
            .then(count => {
            res.status(200).json({
                count: count
            });
        })
            .catch(err => {
            console.error('Error counting documents:', err);
        });
    }),
    postProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, Description, photos, price, Discount, maxQuantity, minQuantity, Status, Category, subCategory } = req.body;
        let photoURLs = [];
        //    const resUploadImage = images.map(
        //       async (photo, index) =>
        //     new Promise(async (resolve, reject) => {
        //       console.log(photo.split(",")[1])
        //       const photoAfterUpload= await uploadPhotoFun(photo?.split(",")[1])
        //       resolve(photoAfterUpload)
        //     })
        // );
        // Promise.all(resUploadImage).then(async (results) => {
        //   console.log(resUploadImage)
        //   const newPosts = new POSTS({
        //     images: results,
        //     user:id
        //   });
        const newProduct = new schemaProducts_1.ProductModel({
            name,
            Description,
            price,
            Discount,
            maxQuantity,
            minQuantity,
            photos,
            Status,
            Category,
            subCategory
        });
        yield newProduct.save();
        res.status(200).json({ success: true });
    }),
    updateProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, name, description, price, stock, images, attributes } = req.body;
        const userUpdate = yield schemaProducts_1.ProductModel.findByIdAndUpdate(id, { name, description, price, stock, images, attributes }, { upsert: true, new: true });
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
    })
};
