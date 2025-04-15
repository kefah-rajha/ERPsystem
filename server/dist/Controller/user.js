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
            const pageNumber = parseInt(req.params.pageNumber) || 1;
            const pageSize = parseInt(req.params.pageSize) || 10;
            const skipItems = (pageNumber - 1) * pageSize;
            const { fieldSort, sort, role, fields, fieldSearch, searchInput, dateRange } = req.body;
            console.log(fieldSort, sort, role, fields, fieldSearch, searchInput);
            if (fields == "All" && role == "All" && searchInput == "" && sort == "1" && dateRange.startDate == "" && dateRange.endDate == "") {
                console.log("test ");
                const users = yield schemaUser_1.UserModel.find({}).skip(skipItems)
                    .populate('companyID') // Populate the companyID field
                    .populate('contactID') // Populate the contactID field
                    .limit(pageSize);
                console.log(users);
                return res.status(200).json({
                    success: true,
                    data: users,
                    message: 'Users retrieved successfully'
                });
            }
            else {
                const query = {};
                if (dateRange) {
                    // Create a date filter if either startDate or endDate is provided
                    if (dateRange.startDate || dateRange.endDate) {
                        // Initialize createdAt object if it doesn't exist
                        query.createdAt = query.createdAt || {};
                        // If startDate is provided, use it; otherwise use a very old date
                        if (dateRange.startDate) {
                            query.createdAt.$gte = new Date(dateRange.startDate);
                        }
                        else {
                            // You can set this to a reasonable "beginning of time" for your application
                            query.createdAt.$gte = new Date('1970-01-01');
                        }
                        // If endDate is provided, use it; otherwise use current date
                        if (dateRange.endDate) {
                            query.createdAt.$lte = new Date(dateRange.endDate);
                        }
                        else {
                            query.createdAt.$lte = new Date(); // Current date and time
                        }
                    }
                }
                // Add role filter if specified and not 'all'
                if (role && role !== 'All') {
                    query.role = role;
                }
                // Add search filter if search input exists
                console.log(searchInput, fieldSearch);
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
                // Add empty/non-empty fields filter
                if (fields === 'empty') {
                    query.$or = [
                        { name: { $eq: '' } },
                        { email: { $eq: '' } },
                    ];
                }
                else if (fields !== 'empty') {
                    query.$and = [
                        { name: { $ne: '' } },
                        { email: { $ne: '' } },
                        { company: { $ne: '' } }
                    ];
                }
                // Build sort options
                const sortOptions = {};
                if (fieldSort) {
                    sortOptions[fieldSort] = sort === '1' ? 1 : -1;
                }
                console.log(query);
                // Execute query with filters and sorting
                const users = yield schemaUser_1.UserModel
                    .find(query)
                    .sort(sortOptions)
                    .skip(skipItems)
                    .limit(pageSize)
                    .populate('companyID') // Populate the companyID field
                    .populate('contactID') // Populate the contactID field
                    .lean();
                // console.log(users)
                return res.status(200).json({
                    success: true,
                    data: users,
                    message: 'Users retrieved successfully'
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                message: error,
                success: false,
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
            return res.status(500).json({
                message: err,
                success: false,
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
                const contactInfoUserData = yield contactInfoUser.save();
                const updatedUser = yield schemaUser_1.UserModel.findByIdAndUpdate(userId, { contactID: contactInfoUserData === null || contactInfoUserData === void 0 ? void 0 : contactInfoUserData._id }, { new: true, runValidators: true });
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
            const { nameCompany, phone, email, address, website, postCode, city, street, } = req.body;
            console.log(req.body, "nameComapny");
            const getDataUSer = yield schemaCompanyUser_1.UserCompanyModel.findOne({ userId: userId });
            if (getDataUSer == null) {
                const companyInfoUser = new schemaCompanyUser_1.UserCompanyModel({
                    userId: userId,
                    nameCompany,
                    phone,
                    email,
                    address,
                    website,
                    postCode,
                    city,
                    street,
                });
                const companyInfoUserData = yield companyInfoUser.save();
                const updatedUser = yield schemaUser_1.UserModel.findByIdAndUpdate(userId, { companyID: companyInfoUserData._id }, { new: true, runValidators: true });
                return res.status(200).json({
                    message: "Update Is Done",
                    success: true,
                });
            }
            else {
                const userAfterUpdate = yield schemaCompanyUser_1.UserCompanyModel.findOneAndUpdate({ userId: userId }, {
                    phone,
                    nameCompany,
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
        console.log(getDataUSer);
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
        console.log(data);
        try {
            const mappedData = data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const userInfo = {
                    userName: item["Username"],
                    password: "12345",
                    name: item["name"],
                    // Brithday: item["Brithday"],
                    role: item["role"],
                    createdAt: item["createdAt"],
                };
                const finale = new schemaUser_1.UserModel(userInfo);
                const userDataAfterSave = yield finale.save();
                const contactInfo = {
                    userId: userDataAfterSave._id,
                    phone: item["Phone"],
                    email: item["email"],
                    address: `${item["city"]}/${item["street"]}/${item["postcode"]} `,
                    website: "web.com",
                    postCode: item["postcode"],
                    city: item["city"],
                    street: item["street"],
                };
                const contactInfoUser = new schemaUserDetails_1.UserDetailsModel(contactInfo);
                yield contactInfoUser.save();
            }));
            return res.status(200).json({
                success: true,
                message: "Import is done",
            });
        }
        catch (error) {
            res.status(402).json({
                message: error.message,
                success: false,
            });
        }
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
    }),
};
