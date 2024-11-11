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
exports.user = void 0;
const schemaUserDetails_1 = require("../Modal/schemaUserDetails");
const schemaCompanyUser_1 = require("../Modal/schemaCompanyUser");
const schemaUser_1 = require("../Modal/schemaUser");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.user = {
    getAllUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { pageNumber } = req.params;
            const { fieldSort, sort, role, fields, fieldSearch, searchInput } = req.body;
            console.log(fields, fieldSearch);
            const sortAsNumber = sort == "1" ? 1 : -1;
            const regex = searchInput == "" ? new RegExp(/^[a-zA-Z0-9]+$/) : new RegExp(`^${searchInput}`, 'i');
            console.log(regex, "regex");
            const search = {
                $match: {
                    [fieldSearch]: { $regex: regex }
                }
            };
            const RoleSort = {
                $match: {
                    role: role
                }
            };
            const SortAlphaB = {
                $sort: {
                    [fieldSort]: sortAsNumber
                }
            };
            const EmptyFields = {
                $match: {
                    $or: [
                        { "contact.email": "" },
                        { "contact.phone": "" },
                        { "company.name": "" },
                        { "name": "" },
                    ]
                }
            };
            const pipeline = [
                {
                    $lookup: {
                        from: "contactInfo",
                        localField: "contactId",
                        foreignField: "_id",
                        as: "contact"
                    }
                },
                {
                    $unwind: {
                        path: "$contact",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        name: { $regex: regex }
                    }
                }
            ];
            if (role !== "All" && fields !== "Empty") {
                console.log("i am working");
                const recallPost = yield schemaUser_1.UserModel.aggregate([...pipeline, RoleSort, SortAlphaB]);
                console.log("i am working", recallPost);
                console.log(recallPost);
                return res.status(200).json({
                    data: recallPost,
                    success: true,
                });
            }
            else if (fields == "Empty" && role !== "All") {
                console.log("i am working2");
                const recallPost = yield schemaUser_1.UserModel.aggregate([...pipeline, search, EmptyFields,
                    RoleSort, SortAlphaB
                ]);
                return res.status(200).json({
                    data: recallPost,
                    success: true,
                });
            }
            else if (fields !== "Empty" && role == "All") {
                console.log("i am working3");
                const recallPost = yield schemaUser_1.UserModel.aggregate([...pipeline, SortAlphaB
                ]);
                console.log("i am working3", recallPost);
                return res.status(200).json({
                    data: recallPost,
                    success: true,
                });
            }
            else if (fields == "Empty" && role == "All") {
                console.log("i am working4");
                console.log(role !== "All" && fields !== "Empty");
                const recallPost = yield schemaUser_1.UserModel.aggregate([...pipeline, search, EmptyFields, SortAlphaB
                ]);
                return res.status(200).json({
                    data: recallPost,
                    success: true,
                });
            }
        }
        catch (error) {
            return res.status(200).json({
                message: error,
                success: true,
            });
        }
    }),
    getNumberUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("scss");
        schemaUser_1.UserModel.countDocuments()
            .then((count) => {
            console.log(count);
            res.status(200).json({
                data: count,
                success: true,
            });
        })
            .catch((err) => {
            return res.status(200).json({
                message: err,
                success: true,
            });
        });
    }),
    updateContactInfoUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const { phone, email, address, website, postCode, city, street } = req.body;
            console.log(userId);
            const getDataUSer = yield schemaUserDetails_1.UserDetailsModel.findOne({ userId: userId });
            if (getDataUSer == null) {
                const contactInfoUser = new schemaUserDetails_1.UserDetailsModel({
                    userId: userId,
                    phone,
                    email,
                    address,
                    website,
                    postCode,
                    city,
                    street,
                });
                yield contactInfoUser.save();
                return res.status(200).json({
                    message: "Update Is Done",
                    success: true,
                });
            }
            else {
                const userAfterUpdate = yield schemaUserDetails_1.UserDetailsModel.findOneAndUpdate({ userId: userId }, {
                    phone,
                    email,
                    address,
                    website,
                    postCode,
                    city,
                    street,
                }, { new: true }); // Return updated user
                if (userAfterUpdate == null) {
                    return res.status(400).json({
                        message: "This user Is'nt Exist",
                        success: false,
                    });
                }
                else {
                    return res.status(200).json({
                        message: "Update Is Done",
                        success: true,
                    });
                }
            }
        }
        catch (error) {
            res.status(402).json(error.message);
        }
    }),
    getProfileInfoUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.id;
        const getDataUSer = yield schemaUser_1.UserModel.findOne({ _id: userId });
        console.log(getDataUSer, "getDataUSer");
        if (!getDataUSer) {
            return res.status(400).json({
                success: false,
            });
        }
        else {
            return res.status(200).json({
                data: getDataUSer,
                success: true,
            });
        }
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            const userAfterUpdate = yield schemaUser_1.UserModel.findOneAndUpdate({ _id: userId }, updateData, { new: true }); // Return updated user
            if (userAfterUpdate == null) {
                return res.status(400).json({
                    message: "This user Is'nt Exist",
                    success: false,
                });
            }
            else {
                return res.status(200).json({
                    data: userAfterUpdate,
                    message: "Update Is Done",
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
    getContactInfoUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.id;
        const getDataUSer = yield schemaUserDetails_1.UserDetailsModel.findOne({ userId: userId });
        if (!getDataUSer) {
            return res.status(400).json({
                success: false,
            });
        }
        else {
            return res.status(200).json({
                data: getDataUSer,
                success: true,
            });
        }
    }),
    updatecompanyInfoUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const { nameComapny, phone, email, address, website, postCode, city, street, } = req.body;
            console.log(userId);
            const getDataUSer = yield schemaCompanyUser_1.UserCompanyModel.findOne({ userId: userId });
            if (getDataUSer == null) {
                const companyInfoUser = new schemaCompanyUser_1.UserCompanyModel({
                    userId: userId,
                    nameComapny,
                    phone,
                    email,
                    address,
                    website,
                    postCode,
                    city,
                    street,
                });
                yield companyInfoUser.save();
                return res.status(200).json({
                    message: "Update Is Done",
                    success: true,
                });
            }
            else {
                const userAfterUpdate = yield schemaCompanyUser_1.UserCompanyModel.findOneAndUpdate({ userId: userId }, {
                    phone,
                    nameComapny,
                    email,
                    address,
                    website,
                    postCode,
                    city,
                    street,
                }, { new: true }); // Return updated user
                if (userAfterUpdate == null) {
                    return res.status(400).json({
                        message: "This user Is'nt Exist",
                        success: false,
                    });
                }
                else {
                    return res.status(200).json({
                        message: "Update Is Done",
                        success: true,
                    });
                }
            }
        }
        catch (error) {
            res.status(402).json(error.message);
        }
    }),
    getCompanyInfo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.id;
        const getDataUSer = yield schemaCompanyUser_1.UserCompanyModel.findOne({ userId: userId });
        if (!getDataUSer) {
            return res.status(400).json({
                success: false,
            });
        }
        else {
            return res.status(200).json({
                data: getDataUSer,
                success: true,
            });
        }
    }),
    ImportUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        const mappedData = data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const userInfo = {
                userName: item["First name"],
                password: "12345",
                name: item["Last name"],
                Brithday: item["Date of birth"],
            };
            const finale = new schemaUser_1.UserModel(userInfo);
            const userDataAfterSave = yield finale.save();
            const contactInfo = {
                userId: finale._id,
                phone: item["Phone"],
                email: item["Email"],
                address: item["Adress"],
                website: "web.com",
                postCode: item["Post/Zip Code"],
                city: item["City"],
                street: item["State / Region"],
            };
            const contactInfoUser = new schemaUserDetails_1.UserDetailsModel(contactInfo);
            yield contactInfoUser.save();
        }));
    }),
    createUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { userName, name, password, Brithday } = req.body;
            const newusername = userName.toLowerCase().replace(/ /g, "");
            const user_name = yield schemaUser_1.UserModel.findOne({ userName: newusername });
            if (user_name) {
                return res.status(400).json({
                    success: false,
                    message: "The User Name Is Exist ,Choose A Unique Username",
                });
            }
            else {
                const finale = new schemaUser_1.UserModel({
                    userName: newusername,
                    password,
                    name,
                    Brithday,
                });
                console.log(finale, "finale");
                const userInfo = yield finale.save();
                if (!userInfo) {
                    return res.status(400).json({
                        success: false,
                        message: "uh, there is thing, try later",
                    });
                }
                return res.status(200).json({
                    data: userInfo,
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
    deleteUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(id);
            const userDelete = yield schemaUser_1.UserModel.findByIdAndDelete(id);
            if (userDelete === null || userDelete === void 0 ? void 0 : userDelete._id) {
                const userContactDelete = yield schemaUserDetails_1.UserDetailsModel.findOneAndDelete({ userId: id });
                const userCompanyDelete = yield schemaCompanyUser_1.UserCompanyModel.findOneAndDelete({ userId: id });
                res.status(200).json({
                    message: "delete user is done",
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
    userFilter: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const filterItem = yield schemaUserDetails_1.UserDetailsModel.aggregate([
            {
                $group: {
                    _id: null,
                    city: { $addToSet: "$city" },
                }
            },
            {
                $project: {
                    _id: 0,
                    city: 1,
                }
            }
        ]);
        res.status(200).json({
            data: filterItem,
            success: true,
        });
    })
};
