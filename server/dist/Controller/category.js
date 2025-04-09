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
exports.category = void 0;
const schemaCategory_1 = require("../Modal/schemaCategory");
exports.category = {
    getAllCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("allCategories");
            const allCategories = yield schemaCategory_1.Category.find({}).populate("children");
            console.log(allCategories);
            return res.status(200).json({
                success: false,
                data: allCategories
            });
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            return res.status(400).json({
                success: false,
                message: `Error fetching categories:${error}`
            });
        }
    }),
    createCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { category, slug, mainCategory } = req.body;
        console.log(category, slug, "name slug");
        const finalCategory = new schemaCategory_1.Category({
            name: category,
            slug,
            parent: null,
            children: [],
            mainCategory
        });
        const saveCategory = yield finalCategory.save();
        if (!saveCategory) {
            return res.status(400).json({
                success: false,
                message: "uh, there is thing, try later",
            });
        }
        else {
            return res.status(200).json({
                success: true,
                data: saveCategory,
            });
        }
    }),
    getCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const resAllCategory = yield schemaCategory_1.Category.find({ parent: null }).populate("children");
            return res.status(200).json({
                data: resAllCategory,
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
    getSelectSubCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("ddd");
            const resAllCategory = yield schemaCategory_1.Category.find();
            return res.status(200).json({
                data: resAllCategory,
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
    updateCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const { category, slug } = req.body;
            const categoryAfterUpdat = yield schemaCategory_1.Category.findOneAndUpdate({ _id: userId }, { $set: {
                    name: category,
                    slug: slug
                } }, { new: true }); // Return updated user
            if (categoryAfterUpdat == null) {
                return res.status(400).json({
                    message: "This category Is'nt Exist",
                    success: false,
                });
            }
            else {
                return res.status(200).json({
                    data: categoryAfterUpdat,
                    success: true,
                });
            }
        }
        catch (error) {
            return res.status(200).json({
                message: error.message,
                success: false,
            });
        }
    }),
    deleteCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(id);
            const CategoryDelete = yield schemaCategory_1.Category.findById(id);
            if (CategoryDelete == null) {
                return res.status(400).json({
                    message: "the Category isnt exist",
                    success: false,
                });
            }
            if (CategoryDelete !== null) {
                if ((CategoryDelete === null || CategoryDelete === void 0 ? void 0 : CategoryDelete.children.length) > 0) {
                    res.status(400).json({
                        message: "this Category has SubCategories, you cant remove it ",
                        success: false,
                    });
                }
                else {
                    const CategoryDeleteAfterSure = yield schemaCategory_1.Category.findByIdAndDelete(id);
                    console.log(CategoryDeleteAfterSure);
                    res.status(400).json({
                        message: "delete this Category is done ",
                        success: true,
                    });
                }
            }
            else {
                res.status(402).json({
                    message: "delete Category is falid",
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
    createSubCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { subcategory, slug, mainCategory } = req.body;
        console.log(id, "name slug");
        const finalCategory = new schemaCategory_1.Category({
            name: subcategory,
            slug,
            parent: id,
            children: [],
            mainCategory
        });
        const saveCategory = yield finalCategory.save();
        if (!saveCategory) {
            return res.status(400).json({
                success: false,
                message: "uh, there is thing, try later",
            });
        }
        else {
            const saveSubCategoryAsChildren = yield schemaCategory_1.Category.findByIdAndUpdate(id, {
                $push: { children: saveCategory._id }
            }, { new: true });
            console.log(saveSubCategoryAsChildren);
            return res.status(200).json({
                success: true,
                data: saveCategory,
            });
        }
    }),
    getSubCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log("ddd");
            const resAllCategory = yield schemaCategory_1.Category.findById(id).populate('children');
            console.log();
            return res.status(200).json({
                data: resAllCategory === null || resAllCategory === void 0 ? void 0 : resAllCategory.children,
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
    updateSubCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const { subcategory, slug } = req.body;
            const subcategoryAfterUpdat = yield schemaCategory_1.Category.findOneAndUpdate({ _id: userId }, {
                $set: {
                    name: subcategory,
                    slug: slug
                }
            }, { new: true }); // Return updated user
            if (subcategoryAfterUpdat == null) {
                return res.status(400).json({
                    message: "This SubCategory Is'nt Exist",
                    success: false,
                });
            }
            else {
                return res.status(200).json({
                    data: subcategoryAfterUpdat,
                    success: true,
                });
            }
        }
        catch (error) {
            return res.status(200).json({
                message: error.message,
                success: false,
            });
        }
    }),
    deleteSubCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { parentID } = req.params;
            console.log(id);
            const subCategoryDelete = yield schemaCategory_1.Category.findById(id);
            if (subCategoryDelete == null) {
                return res.status(400).json({
                    message: "the Category isnt exist",
                    success: false,
                });
            }
            if (subCategoryDelete !== null) {
                if ((subCategoryDelete === null || subCategoryDelete === void 0 ? void 0 : subCategoryDelete.children.length) > 0) {
                    res.status(400).json({
                        message: "this SubCategory has SubCategories, you cant remove it ",
                        success: false,
                    });
                }
                else {
                    const CategoryDeleteAfterSure = yield schemaCategory_1.Category.findByIdAndDelete(id);
                    const pullSubCategoryFromParent = yield schemaCategory_1.Category.updateOne({ _id: parentID }, { $pull: { children: id } });
                    console.log(CategoryDeleteAfterSure, pullSubCategoryFromParent);
                    res.status(400).json({
                        message: "delete this Category is done ",
                        success: true,
                    });
                }
            }
            else {
                res.status(402).json({
                    message: "delete SubCategory is falid",
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
    })
};
