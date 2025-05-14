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
const schemaUser_1 = require("../Modal/schemaUser");
const schemaSupplier_1 = require("../Modal/schemaSupplier");
const schemaProducts_1 = require("../Modal/schemaProducts");
const schemaAccounting_1 = require("../Modal/schemaAccounting");
const mongoose_1 = __importDefault(require("mongoose"));
const schemaSalesOrder_1 = require("../Modal/schemaSalesOrder");
const salesOrder = {
    getSaleOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Extract product ID from request parameters
            const { id } = req.params;
            console.log(id);
            // Validate ID format
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'Invalid saleOrder ID format',
                    success: false,
                });
            }
            // Find saleOrder 
            const saleOrder = yield schemaSalesOrder_1.SalesOrderModel.findById(id).populate("items.product")
                .lean(); // Convert to plain JavaScript object
            // Check if saleOrder exists
            if (!saleOrder) {
                return res.status(404).json({
                    message: 'Product not found',
                    success: false,
                });
            }
            // Send successful response
            res.status(200).json({
                posts: saleOrder,
                success: true,
                message: 'saleOrder retrieved successfully',
            });
        }
        catch (error) {
            // Enhanced error handling
            console.error('Error in getProduct:', error);
            // Type the error for better handling
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return res.status(500).json({
                message: 'Server error while retrieving saleOrder',
                error: errorMessage,
                success: false,
            });
        }
    }),
    searchCustomer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchQuery = req.query.name || '';
            const regex = new RegExp(`^${searchQuery}`, 'i');
            const customers = yield schemaUser_1.UserModel.find({
                userName: regex,
                role: 'Customer' // Only search users with customer role
            })
                .populate('contactID')
                .limit(5);
            console.log(customers);
            return res.status(200).json({
                data: customers,
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
    searchSupplier: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchQuery = req.query.name || '';
            // Create a case-insensitive regular expression for name search
            const regex = new RegExp(`^${searchQuery}`, 'i');
            const SearchQueries = [
                {
                    $or: [
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $concat: ['$firstName', ' ', '$lastName'] },
                                    regex: new RegExp(regex, 'i')
                                }
                            }
                        }
                    ]
                }
            ];
            const supplier = yield schemaSupplier_1.supplierModel.find({
                $or: SearchQueries
            })
                .select('firstName lastName')
                .limit(5)
                .exec();
            console.log(supplier);
            return res.status(200).json({
                data: supplier,
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
    searchProductSalesOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { fieldSearch, searchInput } = req.body;
        const searchQuery = {
            [fieldSearch]: {
                $regex: new RegExp(searchInput, 'i')
            }
        };
        console.log(searchQuery);
        try {
            const products = yield schemaProducts_1.ProductModel.find(searchQuery)
                .limit(5);
            console.log(products);
            return res.status(200).json({
                data: products,
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
    createSalesOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            console.log(data.values.currency, "data?.values");
            const order = new schemaSalesOrder_1.SalesOrderModel({
                orderNumber: `SO-${Date.now()}`,
                customer: {
                    userName: data === null || data === void 0 ? void 0 : data.values.customer,
                    shipmentAddress: data === null || data === void 0 ? void 0 : data.values.shipmentAddress,
                    phone: data === null || data === void 0 ? void 0 : data.values.phone,
                    customerEmail: data === null || data === void 0 ? void 0 : data.values.customerEmail
                },
                supplier: {
                    name: data === null || data === void 0 ? void 0 : data.values.supplier
                },
                items: data.items,
                salesManager: data === null || data === void 0 ? void 0 : data.values.salesManager,
                shipmentDate: new Date(data === null || data === void 0 ? void 0 : data.values.shipmentDate),
                netTotal: data === null || data === void 0 ? void 0 : data.values.netAmount,
                totalVat: data === null || data === void 0 ? void 0 : data.values.vatAmount,
                totalAmount: data === null || data === void 0 ? void 0 : data.values.totalAmount,
                vatRate: data === null || data === void 0 ? void 0 : data.values.vatRate,
                currency: data === null || data === void 0 ? void 0 : data.values.currency,
                paymentTerm: data === null || data === void 0 ? void 0 : data.values.paymentTerm,
                bankAccount: data === null || data === void 0 ? void 0 : data.values.bankAccount,
                status: data === null || data === void 0 ? void 0 : data.values.status
            });
            const saveOrder = yield order.save();
            const accountId = data === null || data === void 0 ? void 0 : data.values.bankAccount;
            const salesOrder = {
                _id: saveOrder._id.toString(),
                orderNumber: saveOrder.orderNumber,
                amount: data === null || data === void 0 ? void 0 : data.values.totalAmount,
                status: data === null || data === void 0 ? void 0 : data.values.status
            };
            const updatedAccount = yield addSalesOrderToAccount(accountId, salesOrder);
            if (!updatedAccount) {
                return res.status(404).json({ message: 'Account not found', success: false, });
            }
            console.log(saveOrder);
            if (saveOrder) {
                return res.status(200).json({
                    data: saveOrder,
                    success: true,
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error,
                success: false,
            });
        }
    }),
    getSalesOrders: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { from, to, page = 1, limit = 10 } = req.query;
            console.log(from, to, page, limit);
            // Validate input dates
            if (!from || !to) {
                return res.status(400).json({
                    message: 'Both from and to dates are required'
                });
            }
            // Convert string dates to Date objects
            const fromDate = new Date(from);
            const toDate = new Date(to);
            // Calculate skip value for pagination
            const skip = (page - 1) * limit;
            // Retrieve total count of orders
            const totalOrders = yield schemaSalesOrder_1.SalesOrderModel.countDocuments({
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            });
            // Retrieve paginated Sales Orders
            const salesOrders = yield schemaSalesOrder_1.SalesOrderModel.find({
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate("items.product", "name _id price");
            // Calculate total pages
            const totalPages = Math.ceil(totalOrders / limit);
            // Return paginated results
            res.status(200).json({
                page: Number(page),
                totalPages,
                totalOrders,
                ordersCount: salesOrders.length,
                salesOrders
            });
        }
        catch (error) {
            res.status(500).json({
                message: 'Error retrieving sales orders',
                error: error
            });
        }
    }),
    deleteSalesOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params; // ID of the SalesOrderModel document to delete
            // 1. البحث عن مستند Sales Order *قبل* حذفه للحصول على accountId
            const salesOrderToDelete = yield schemaSalesOrder_1.SalesOrderModel.findById(id);
            if (!salesOrderToDelete) {
                // طلب المبيعات غير موجود أصلاً، لا يوجد ما نحذفه أو نحدثه
                return res.status(404).json({
                    message: "Sales Order not found.",
                    success: false,
                });
            }
            const accountId = salesOrderToDelete.bankAccount; // الحصول على معرف الحساب المرتبط
            // 2. حذف مستند SalesOrderModel الرئيسي
            const deleteResult = yield schemaSalesOrder_1.SalesOrderModel.deleteOne({ _id: id }); // استخدام deleteOne أكثر مرونة
            if (deleteResult.deletedCount === 0) {
                // هذا لا يجب أن يحدث إذا وجدناه في الخطوة 1، لكن هو فحص دفاعي
                return res.status(500).json({
                    message: "Failed to delete Sales Order document.",
                    success: false,
                });
            }
            console.log(`Sales Order ${id} deleted from SalesOrderModel collection.`);
            // --- بدء منطق تحديث الحساب المرتبط (إذا كان accountId موجوداً) ---
            if (accountId) {
                // 3. البحث عن مستند الحساب المرتبط
                const account = yield schemaAccounting_1.accounModel.findById(accountId);
                if (!account) {
                    console.error(`Account ${accountId} not found for deleted Sales Order ID ${id}. Account totals not updated.`);
                    // يمكننا الاستمرار حيث أن طلب البيع قد حذف، لكن نسجل الخطأ
                }
                else {
                    // 4. إزالة طلب المبيعات المحذوف من مصفوفة salesOrder في مستند Account
                    const pullResult = yield schemaAccounting_1.accounModel.updateOne({ _id: accountId }, { $pull: { salesOrder: { _id: new mongoose_1.default.Types.ObjectId(id) } } } // إزالة العنصر الذي يطابق ID طلب البيع المحذوف
                    );
                    if (pullResult.modifiedCount === 0) {
                        console.warn(`Sales Order ID ${id} not found in Account ${accountId}'s salesOrder array during pull operation.`);
                        // هذا يمكن أن يحدث إذا العنصر لم يكن موجوداً في المصفوفة أصلاً.
                        // التجميع اللاحق سيظل يعمل على العناصر المتبقية وهو صحيح.
                    }
                    else {
                        console.log(`Sales Order ID ${id} pulled from Account ${accountId}'s salesOrder array.`);
                    }
                    if (pullResult.matchedCount > 0) {
                        // 5. تشغيل Aggregation Pipeline على مستند Account لإعادة حساب المجاميع والإحصائيات
                        const aggregationResult = yield schemaAccounting_1.accounModel.aggregate([
                            { $match: { _id: new mongoose_1.default.Types.ObjectId(accountId) } }, // استخدم ObjectId إذا كان accountId نصاً
                            { $unwind: "$salesOrder" }, // افصل عناصر المصفوفة إلى مستندات منفصلة مؤقتاً
                            {
                                $group: {
                                    _id: "$_id",
                                    initalAmount: { $first: "$initalAmount" }, // اجمع النتائج مرة أخرى بناءً على معرف الحساب
                                    calculatedTotalAmount: { $sum: "$salesOrder.amount" }, // اجمع إجمالي المبالغ
                                    calculatedCompleted: { $sum: { $cond: [{ $eq: ["$salesOrder.status", "completed"] }, 1, 0] } }, // عد العمليات المكتملة
                                    calculatedPending: { $sum: { $cond: [{ $ne: ["$salesOrder.status", "completed"] }, 1, 0] } }, // عد العمليات المعلقة
                                    calculatedRemainingValue: { $sum: { $cond: [{ $ne: ["$salesOrder.status", "completed"] }, "$salesOrder.amount", 0] } } // اجمع قيم العمليات المعلقة
                                }
                            }
                        ]);
                        console.log(aggregationResult, "aggregationResult");
                        let newTotalAmount = 0;
                        let newCompleted = 0;
                        let newPending = 0;
                        let newRemainingValue = 0;
                        let deposits = 0;
                        if (aggregationResult.length > 0) {
                            const result = aggregationResult[0];
                            newTotalAmount = result.calculatedTotalAmount;
                            newCompleted = result.calculatedCompleted;
                            newPending = result.calculatedPending;
                            newRemainingValue = result.calculatedRemainingValue;
                            deposits = result.calculatedTotalAmount;
                        }
                        else {
                            // هذا يحدث إذا أصبحت مصفوفة salesOrder فارغة (مثلاً بعد حذف كل العناصر)
                            console.warn(`Aggregation for Account ${accountId} returned no results. Setting totals to 0.`);
                        }
                        // 6. تحديث مستند Account بالحقول التجميعية الجديدة المحسوبة
                        const updatedAccount = yield schemaAccounting_1.accounModel.findByIdAndUpdate(accountId, {
                            $set: {
                                amount: newTotalAmount, // تحديث الحقل 'amount' بالمجموع الجديد
                                completedOperations: newCompleted, // تحديث عدد العمليات المكتملة
                                pendingOperations: newPending, // تحديث عدد العمليات المعلقة
                                remainingOperationsValue: newRemainingValue,
                                deposits: deposits // تحديث قيمة العمليات المعلقة
                            }
                        }, { new: true } // لإرجاع مستند الحساب بعد التحديث
                        );
                        // });
                    }
                }
            }
            else {
                // هذا يحدث إذا كان طلب المبيعات المحذوف لم يكن مرتبطاً بأي حساب
                console.warn(`Deleted Sales Order ${id} had no accountId. Account totals not updated.`);
            }
            // --- انتهاء منطق تحديث الحساب المرتبط ---
            // 7. إرسال الاستجابة النهائية لعملية الحذف الأصلية
            res.status(200).json({
                message: "Sales Order deleted successfully.",
                success: true,
            });
        }
        catch (error) { // استخدم any لتسجيل رسالة الخطأ
            console.error("Error deleting Sales Order or updating Account:", error); // سجل الخطأ
            res.status(500).json({
                message: error.message || "An error occurred during the deletion process.",
                success: false,
                error: error // اختياري: قم بتضمين كائن الخطأ
            });
        }
    }),
    UpdateSaleOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        try {
            const { id } = req.params; // ID of the SalesOrderModel document
            const data = req.body; // البيانات الجديدة لطلب المبيعات
            // نفترض أن البيانات الواردة في req.body مشابهة لما تم إنشاؤه في الدالة الأصلية
            // ويجب أن تحتوي على accountId أو يتم جلبه من مستند SalesOrderModel
            // 1. استرجاع مستند SalesOrderModel الأصلي للحصول على accountId الخاص به
            const originalSalesOrder = yield schemaSalesOrder_1.SalesOrderModel.findById(id);
            if (!originalSalesOrder) {
                return res.status(404).json({ message: "Sales Order not found", success: false });
            }
            const accountId = originalSalesOrder.bankAccount; // افترض وجود هذا الحقل يربط الطلب بالحساب
            console.log(accountId, "accountId");
            if (!accountId) {
                // يجب أن يكون لكل طلب بيع حساب مرتبط به ليعمل هذا المنطق
                console.error(`Sales Order ${id} is not linked to any Account.`);
                // يمكنك اختيار إرجاع خطأ أو الاستمرار في تحديث طلب البيع فقط
                return res.status(400).json({ message: "Sales Order is not linked to an account.", success: false });
            }
            // 2. تحضير بيانات التحديث لمستند SalesOrderModel
            // ملاحظة: orderNumber لا يجب أن يتغير عند التعديل، هذه قد تكون مشكلة في الكود الأصلي
            const dataSaleOrder = {
                customer: {
                    userName: (_a = data === null || data === void 0 ? void 0 : data.values) === null || _a === void 0 ? void 0 : _a.customer,
                    shipmentAddress: (_b = data === null || data === void 0 ? void 0 : data.values) === null || _b === void 0 ? void 0 : _b.shipmentAddress,
                    phone: (_c = data === null || data === void 0 ? void 0 : data.values) === null || _c === void 0 ? void 0 : _c.phone,
                    customerEmail: (_d = data === null || data === void 0 ? void 0 : data.values) === null || _d === void 0 ? void 0 : _d.customerEmail
                },
                supplier: {
                    name: (_e = data === null || data === void 0 ? void 0 : data.values) === null || _e === void 0 ? void 0 : _e.supplier
                },
                items: data.items, // يجب أن يتضمن items تفاصيل البنود
                salesManager: (_f = data === null || data === void 0 ? void 0 : data.values) === null || _f === void 0 ? void 0 : _f.salesManager,
                // تأكد من أن shipmentDate يتم تحويله إلى Date إذا لزم الأمر
                shipmentDate: ((_g = data === null || data === void 0 ? void 0 : data.values) === null || _g === void 0 ? void 0 : _g.shipmentDate) ? new Date(data.values.shipmentDate) : undefined,
                netTotal: (_h = data === null || data === void 0 ? void 0 : data.values) === null || _h === void 0 ? void 0 : _h.netAmount,
                totalVat: (_j = data === null || data === void 0 ? void 0 : data.values) === null || _j === void 0 ? void 0 : _j.vatAmount,
                totalAmount: (_k = data === null || data === void 0 ? void 0 : data.values) === null || _k === void 0 ? void 0 : _k.totalAmount, // <--- هذه هي القيمة الإجمالية المحدثة لطلب البيع هذا
                vatRate: (_l = data === null || data === void 0 ? void 0 : data.values) === null || _l === void 0 ? void 0 : _l.vatRate,
                includeVat: (_m = data === null || data === void 0 ? void 0 : data.values) === null || _m === void 0 ? void 0 : _m.includeVat,
                currency: (_o = data === null || data === void 0 ? void 0 : data.values) === null || _o === void 0 ? void 0 : _o.currency,
                paymentTerm: (_p = data === null || data === void 0 ? void 0 : data.values) === null || _p === void 0 ? void 0 : _p.paymentTerm,
                bankAccount: (_q = data === null || data === void 0 ? void 0 : data.values) === null || _q === void 0 ? void 0 : _q.bankAccount,
                status: (_r = data === null || data === void 0 ? void 0 : data.values) === null || _r === void 0 ? void 0 : _r.status // <--- هذه هي الحالة المحدثة لطلب البيع هذا
            };
            // 3. تحديث مستند SalesOrderModel الرئيسي
            const updatedSalesOrder = yield schemaSalesOrder_1.SalesOrderModel.findByIdAndUpdate(id, dataSaleOrder, { new: true } // لإرجاع المستند بعد التحديث
            );
            const newSalesOrderObjectForArray = {
                _id: updatedSalesOrder === null || updatedSalesOrder === void 0 ? void 0 : updatedSalesOrder._id.toString(),
                orderNumber: updatedSalesOrder === null || updatedSalesOrder === void 0 ? void 0 : updatedSalesOrder.orderNumber,
                amount: updatedSalesOrder === null || updatedSalesOrder === void 0 ? void 0 : updatedSalesOrder.totalAmount,
                status: updatedSalesOrder === null || updatedSalesOrder === void 0 ? void 0 : updatedSalesOrder.status
            };
            const accountArrayReplaceResult = yield schemaAccounting_1.accounModel.updateOne({ _id: updatedSalesOrder === null || updatedSalesOrder === void 0 ? void 0 : updatedSalesOrder.bankAccount }, // 1. ابحث عن مستند الحساب بالـ ID
            {
                $set: {
                    // 2. استخدم $set لتعيين العنصر المطابق بالكامل إلى الكائن الجديد
                    // "elem" هو اسم المعرف المستخدم في arrayFilters
                    "salesOrder.$[elem]": newSalesOrderObjectForArray, // تعيين العنصر بأكمله ليساوي الكائن الجديد
                }
            }, {
                // 3. استخدم arrayFilters لتحديد العنصر الذي سيتم استبداله
                // ابحث عن العنصر حيث حقل _id يطابق salesOrderIdToReplace
                arrayFilters: [
                    { "elem._id": new mongoose_1.default.Types.ObjectId(updatedSalesOrder === null || updatedSalesOrder === void 0 ? void 0 : updatedSalesOrder._id) } // تأكد من تحويل ID إلى ObjectId
                ],
                // لا حاجة لـ { new: true } مع updateOne
            });
            console.log(accountArrayReplaceResult, "accountArrayReplaceResult");
            if (!updatedSalesOrder) {
                // يجب أن يتم العثور عليه إذا كان originalSalesOrder موجوداً، لكن للتحقق
                return res.status(500).json({ message: "Failed to update Sales Order document.", success: false });
            }
            if (accountArrayReplaceResult.matchedCount === 0) {
                console.warn(`Account ${accountId} found, but Sales Order ID ${updatedSalesOrder._id} not found in its salesOrder array.`);
                // إذا لم يتم العثور على العنصر في المصفوفة، لا يمكن إعادة حساب المجموع بشكل صحيح.
                // يمكنك اختيار إرجاع خطأ أو تحذير هنا. سنستمر في التجميع ولكن مع تحذير.
            }
            if (accountArrayReplaceResult.matchedCount > 0) {
                const AccountDetails = yield schemaAccounting_1.accounModel.findOne({ _id: accountId });
                if (AccountDetails) {
                    const withdrawalsValue = AccountDetails === null || AccountDetails === void 0 ? void 0 : AccountDetails.withdrawals;
                    if (AccountDetails.salesOrder.length > 0) {
                        console.log(AccountDetails, "AccountDetails");
                        // 5. تشغيل Aggregation Pipeline على مستند Account لإعادة حساب المجاميع والإحصائيات
                        const aggregationResult = yield schemaAccounting_1.accounModel.aggregate([
                            { $match: { _id: new mongoose_1.default.Types.ObjectId(accountId) } }, // استخدم ObjectId إذا كان accountId نصاً
                            { $unwind: "$salesOrder" }, // افصل عناصر المصفوفة إلى مستندات منفصلة مؤقتاً
                            {
                                $group: {
                                    _id: "$_id",
                                    // اجمع النتائج مرة أخرى بناءً على معرف الحساب
                                    calculatedTotalAmount: { $sum: "$salesOrder.amount" }, // اجمع إجمالي المبالغ
                                    calculatedCompleted: { $sum: { $cond: [{ $eq: ["$salesOrder.status", "completed"] }, 1, 0] } }, // عد العمليات المكتملة
                                    calculatedPending: { $sum: { $cond: [{ $ne: ["$salesOrder.status", "completed"] }, 1, 0] } }, // عد العمليات المعلقة
                                    calculatedRemainingValue: { $sum: { $cond: [{ $ne: ["$salesOrder.status", "completed"] }, "$salesOrder.amount", 0] } } // اجمع قيم العمليات المعلقة
                                }
                            }
                        ]);
                        console.log(aggregationResult[0], "aggregationResult");
                        let newTotalAmount = 0;
                        let newCompleted = 0;
                        let newPending = 0;
                        let newRemainingValue = 0;
                        let deposits = 0;
                        if (aggregationResult.length > 0) {
                            const result = aggregationResult[0];
                            newTotalAmount = result.calculatedTotalAmount;
                            newCompleted = result.calculatedCompleted;
                            newPending = result.calculatedPending;
                            newRemainingValue = result.calculatedRemainingValue;
                            deposits = result.calculatedTotalAmount;
                        }
                        else {
                            // هذا يحدث إذا أصبحت مصفوفة salesOrder فارغة (مثلاً بعد حذف كل العناصر)
                            console.warn(`Aggregation for Account ${accountId} returned no results. Setting totals to 0.`);
                        }
                        // 6. تحديث مستند Account بالحقول التجميعية الجديدة المحسوبة
                        const updatedAccount = yield schemaAccounting_1.accounModel.findByIdAndUpdate(accountId, {
                            $set: {
                                amount: withdrawalsValue + deposits, // تحديث الحقل 'amount' بالمجموع الجديد
                                completedOperations: newCompleted, // تحديث عدد العمليات المكتملة
                                pendingOperations: newPending, // تحديث عدد العمليات المعلقة
                                remainingOperationsValue: newRemainingValue,
                                deposits: deposits // تحديث قيمة العمليات المعلقة
                            }
                        }, { new: true } // لإرجاع مستند الحساب بعد التحديث
                        );
                        console.log(updatedAccount, "updatedAccount");
                        // --- انتهاء منطق تحديث الحساب المرتبط ---
                    }
                }
                // 7. إرسال الرد النهائي
                res.status(200).json({
                    // يمكنك إعادة مستند SalesOrderModel المحدث
                    data: updatedSalesOrder, // يمكنك أيضاً إعادة مستند Account المحدث إذا احتاجه الواجهة الأمامية
                    success: true,
                    message: "Sales Order and associated Account totals updated successfully."
                });
            }
        }
        catch (error) { // استخدم any لتسجيل رسالة الخطأ
            console.error("Error updating Sales Order or Account:", error); // سجل الخطأ للتصحيح
            return res.status(400).json({
                message: error.message || "An error occurred during the update.", // أرسل رسالة خطأ مناسبة
                success: false,
                error: error // يمكنك إرسال كائن الخطأ الكامل للتصحيح في بيئات التطوير
            });
        }
    }),
};
exports.default = salesOrder;
const addSalesOrderToAccount = (accountId, salesOrder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Determine if this is a deposit (positive amount) or withdrawal (negative amount)
        // For sales orders, typically money comes IN to the account (deposit)
        const isDeposit = true; // Sales orders are typically deposits
        // Find and update the account
        const updatedAccount = yield schemaAccounting_1.accounModel.findByIdAndUpdate(accountId, {
            $push: { salesOrder: salesOrder },
            $inc: {
                // Increment deposits with the sales order amount
                deposits: isDeposit ? salesOrder.amount : 0,
                // Update total amount in account
                amount: salesOrder.amount,
                // Increment completed operations
                completedOperations: salesOrder.status === 'completed' ? 1 : 0,
                // Increment pending operations
                pendingOperations: salesOrder.status !== 'completed' ? 1 : 0,
                // Update remainingOperationsValue if status is not completed
                remainingOperationsValue: salesOrder.status !== 'completed' ? salesOrder.amount : 0
            }
        }, { new: true } // Return the updated document
        );
        return updatedAccount;
    }
    catch (error) {
        console.error('Error adding sales order to account:', error);
        throw error;
    }
});
