import { userAuthType } from "../DataType/authType";

import { UserModel } from "../Modal/schemaUser";
import { supplierModel } from "../Modal/schemaSupplier";
import { ProductModel } from "../Modal/schemaProducts"


import mongoose, { Types } from "mongoose";
import { SalesOrderModel } from "../Modal/schemaSalesOrder";
import { PurchaseOrderModel } from "../Modal/schemaPurchaseOrder";
const purchaseOrderController = {


    getPurchaseOrder: async (req: any, res: any) => {
        try {
          // Extract purchase order ID from request parameters
          const { id } = req.params;
          console.log(id);
      
          // Validate ID format
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
              message: 'Invalid purchase order ID format',
              success: false,
            });
          }
      
          // Find purchase order
          // Assuming PurchaseOrderModel has an 'items' field with a 'product' subfield to populate
          const purchaseOrder = await PurchaseOrderModel.findById(id).populate("items.product")
            .lean(); // Convert to plain JavaScript object
      
          // Check if purchase order exists
          if (!purchaseOrder) {
            return res.status(404).json({
              message: 'Purchase order not found', // Corrected message
              success: false,
            });
          }
      
          // Send successful response
          res.status(200).json({
            purchaseOrder: purchaseOrder, // Changed key to purchaseOrder
            success: true,
            message: 'Purchase order retrieved successfully',
          });
      
        } catch (error) {
          // Enhanced error handling
          console.error('Error in getPurchaseOrder:', error); // Changed function name in log
      
          // Type the error for better handling
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
          return res.status(500).json({
            message: 'Server error while retrieving purchase order', // Changed message
            error: errorMessage,
            success: false,
          });
        }
      },





    getPurchaseOrders: async (req: any, res: any) => {
        console.log(req.query,"query")
        try {
          
            const { from, to, pageNumber = 1, pageSize = 10 } = req.query;


            // Validate input dates
            if (!from || !to) {
                return res.status(400).json({
                    message: 'Both from and to dates are required as query parameters (e.g., ?from=YYYY-MM-DD&to=YYYY-MM-DD)'
                });
            }

            // Convert string dates to Date objects
            // Using new Date() might be lenient with formats. For stricter validation,
            // consider a dedicated date parsing library or more explicit checks.
            const fromDate = new Date(from as string);
            const toDate = new Date(to as string);

            // Validate and parse pagination parameters from the path
            const page = parseInt(pageNumber as string, 10);
            const limit = parseInt(pageSize as string, 10);

            // Check if parsing resulted in valid, positive integers
            if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid pageNumber or pageSize. Must be positive integers provided in the URL path.'
                });
            }

            // Optional: Add an upper limit to pageSize to prevent excessively large requests
            const effectiveLimit = Math.min(limit, 100); // Example: max 100 items per page

            // Calculate skip value for pagination
            const skip = (page - 1) * effectiveLimit;

            // Build the query filter object
            const filter: any = {
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            };
          

            // Retrieve total count of matching purchase orders
            const totalPurchaseOrders = await PurchaseOrderModel.countDocuments(filter);

            // Retrieve paginated Purchase Orders
            const purchaseOrders = await PurchaseOrderModel.find(filter)
                .sort({ createdAt: -1 }) // Sort by creation date descending (newest first)
                .skip(skip)
                .limit(effectiveLimit)
                .populate("items.product", "name _id price"); // Assuming PurchaseOrderModel structure is similar to SalesOrderModel

            // Calculate total pages
            const totalPages = Math.ceil(totalPurchaseOrders / effectiveLimit);

            // Return paginated results
            res.status(200).json({
                success: true,
                currentPage: page,
                itemsPerPage: effectiveLimit,
                totalPages,
                totalItems: totalPurchaseOrders,
                currentItemCount: purchaseOrders.length, // Number of items returned in the current page
                purchaseOrders // The array of purchase order documents
            });

        } catch (error: unknown) {
            // Log the error server-side for debugging
            console.error('Error retrieving purchase orders:', error);

            // Send a generic error response to the client
            res.status(500).json({
                success: false,
                message: 'Error retrieving purchase orders',
                // Only send basic error info to the client in production
                error: (error instanceof Error) ? error.message : 'An unknown error occurred'
            });
        }
    },




    createPurchaseOrder: async (req: any, res: any) => {
        try {
            const data = req.body;
            console.log(data.values, "Purchase order data");

            // Create a new purchase order based on the interface and incoming data
            const purchaseOrder = new PurchaseOrderModel({
                purchaseOrderNumber: data?.values.purchaseOrderNumber || `PO-${Date.now()}`,
                orderDate: new Date(data?.values.orderDate),
                expectedDeliveryDate: new Date(data?.values.expectedDeliveryDate),
                requestedBy: data?.values.requestedBy,
                supplier: {
                    name: data?.values.supplier.name,
                    contactPerson: data?.values.supplier.contactPerson,
                    supplierEmail: data?.values.supplier.supplierEmail,
                    phone: data?.values.supplier.phone,
                    address: data?.values.supplier.address,
                    taxId: data?.values.supplier.taxId
                },
                shippingAddress: data?.values.shippingAddress,
                items: data.items.map((item: any) => ({
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    vat: item.vat,
                    vatAmount: item.vatAmount,
                    totalAmount: item.totalAmount
                })),
                netTotal: data?.values.netTotal,
                totalVat: data?.values.totalVat,
                totalAmount: data?.values.totalAmount,
                status: data?.values.status || "draft",
                notes: data?.values.notes,
                currency: data?.values.currency,
                paymentTerm: data?.values.paymentTerm,
                vatRate: data?.values.vatRate,
            });

            const savedPurchaseOrder = await purchaseOrder.save();
            console.log(savedPurchaseOrder);

            if (savedPurchaseOrder) {
                return res.status(200).json({
                    data: savedPurchaseOrder,
                    success: true,
                });
            }

        } catch (error: unknown) {
            console.log(error);
            return res.status(500).json({
                message: error instanceof Error ? error.message : "An unknown error occurred",
                success: false,
            });
        }
    },
    searchSupplier: async (req: any, res: any) => {
        try {
            const searchQuery = req.query.name || '';

            // Create a case-insensitive regular expression for name search
            const regex = new RegExp(`^${searchQuery}`, 'i');
            const suppliers = await supplierModel.find({
                $expr: {
                    $regexMatch: {
                        input: { $concat: ['$firstName', ' ', '$lastName'] },
                        regex: regex
                    }
                }
            })
                .limit(5)
                .exec();

            console.log(suppliers)

            return res.status(200).json({
                data: suppliers,
                success: true,
            });

        } catch (error) {
            return res.status(500).json({
                message: error,
                success: false,
            });
        }

    },
    updatePurchaseOrder: async (req: any, res: any) => {
        try {

            const { id } = req.params;
            const data = req.body
            const purchaseOrder = {
                purchaseOrderNumber: data?.values.purchaseOrderNumber || `PO-${Date.now()}`,
                orderDate: new Date(data?.values.orderDate),
                expectedDeliveryDate: new Date(data?.values.expectedDeliveryDate),
                requestedBy: data?.values.requestedBy,
                supplier: {
                    name: data?.values.supplier.name,
                    contactPerson: data?.values.supplier.contactPerson,
                    supplierEmail: data?.values.supplier.supplierEmail,
                    phone: data?.values.supplier.phone,
                    address: data?.values.supplier.address,
                    taxId: data?.values.supplier.taxId
                },
                shippingAddress: data?.values.shippingAddress,
                items: data.items.map((item: any) => ({
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    vat: item.vat,
                    vatAmount: item.vatAmount,
                    totalAmount: item.totalAmount
                })),
                netTotal: data?.values.netTotal,
                totalVat: data?.values.totalVat,
                totalAmount: data?.values.totalAmount,
                status: data?.values.status || "draft",
                notes: data?.values.notes,
                currency: data?.values.currency,
                paymentTerm: data?.values.paymentTerm,
                vatRate: data?.values.vatRate,
            };
            const UpdateData = await PurchaseOrderModel.findByIdAndUpdate(id, purchaseOrder, { new: true })
            console.log(UpdateData, "update")
            res.status(200).json({
              posts: UpdateData,
              success: true,
            })
      
          } catch (error) {
            return res.status(400).json({
              message: error,
              success: false,
            });
          }
      
    },
    deletePurchaseOrder: async (req: any, res: any) => {
        try {
          const { id } = req.params;
    
    
          const saleOrderDelete = await PurchaseOrderModel.findByIdAndDelete(id);
          console.log(saleOrderDelete)
          if (saleOrderDelete?._id) {
    
            res.status(200).json({
              message: "delete sales order is done",
              success: true,
            });
    
    
          } else {
            res.status(402).json({
              message: "delete user is falid",
              success: false,
            });
    
          }
        } catch (error: unknown) {
          res.status(402).json({
            message: error as string,
            success: false,
          });
        }
      },

}
export default purchaseOrderController