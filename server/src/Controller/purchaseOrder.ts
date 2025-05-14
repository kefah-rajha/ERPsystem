import { userAuthType } from "../DataType/authType";

import { UserModel } from "../Modal/schemaUser";
import { supplierModel } from "../Modal/schemaSupplier";
import { ProductModel } from "../Modal/schemaProducts"


import mongoose, { Types } from "mongoose";
import { SalesOrderModel } from "../Modal/schemaSalesOrder";
import { PurchaseOrderModel } from "../Modal/schemaPurchaseOrder";
import { accounModel } from "../Modal/schemaAccounting";
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
    console.log(req.query, "query")
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
        bankAccount: data?.values.bankAccount,

      });

      const savedPurchaseOrder = await purchaseOrder.save();
      console.log(savedPurchaseOrder);
      if (savedPurchaseOrder) {
        const accountId = data?.values.bankAccount;
        const purchaseOrderDetails = {
          _id: savedPurchaseOrder._id.toString(),
          orderNumber: savedPurchaseOrder.purchaseOrderNumber,
          amount: data?.values.totalAmount,
          status: data?.values.status
        };
        const updatedAccount = await addSalesOrderToAccount(accountId, purchaseOrderDetails);

      }


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
    const { id } = req.params; // ID of the PurchaseOrderModel document
    const data = req.body; // New data for the purchase order

    // 1. Retrieve the original PurchaseOrderModel document to get its accountId
    const originalPurchaseOrder = await PurchaseOrderModel.findById(id);

    if (!originalPurchaseOrder) {
      return res.status(404).json({ message: "Purchase Order not found", success: false });
    }

    const accountId = originalPurchaseOrder.bankAccount; // Assuming this field links the order to the account
    console.log(accountId, "accountId");
    
    if (!accountId) {
      // Each purchase order should be linked to an account for this logic to work
      console.error(`Purchase Order ${id} is not linked to any Account.`);
      // You can choose to return an error or continue to update just the purchase order
      return res.status(400).json({ message: "Purchase Order is not linked to an account.", success: false });
    }

    // 2. Prepare update data for the PurchaseOrderModel document
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
      bankAccount: accountId // Ensure the bankAccount field is preserved
    };

    // 3. Update the main PurchaseOrderModel document
    const updatedPurchaseOrder = await PurchaseOrderModel.findByIdAndUpdate(
      id,
      purchaseOrder,
      { new: true } // To return the document after update
    );

    if (!updatedPurchaseOrder) {
      // Should be found if originalPurchaseOrder exists, but check anyway
      return res.status(500).json({ message: "Failed to update Purchase Order document.", success: false });
    }

    // 4. Create a simplified object for the account's purchaseOrder array
    const newPurchaseOrderObjectForArray = {
      _id: updatedPurchaseOrder?._id.toString(),
      orderNumber: updatedPurchaseOrder?.purchaseOrderNumber,
      amount: updatedPurchaseOrder?.totalAmount,
      status: updatedPurchaseOrder?.status
    };

    // 5. Update the specific purchase order in the account's purchaseOrder array
    const accountArrayReplaceResult = await accounModel.updateOne(
      { _id: updatedPurchaseOrder?.bankAccount }, // 1. Find the account document by ID
      {
        $set: {
          // 2. Use $set to replace the matching element with the new object
          // "elem" is the identifier used in arrayFilters
          "purchaseOrder.$[elem]": newPurchaseOrderObjectForArray, // Set the entire element to equal the new object
        }
      },
      {
        // 3. Use arrayFilters to identify which element to replace
        // Find the element where _id field matches updatedPurchaseOrder._id
        arrayFilters: [
          { "elem._id": new mongoose.Types.ObjectId(updatedPurchaseOrder?._id) } // Make sure to convert ID to ObjectId
        ],
        // No need for { new: true } with updateOne
      }
    );
    
    console.log(accountArrayReplaceResult, "accountArrayReplaceResult");

    if (accountArrayReplaceResult.matchedCount === 0) {
      console.warn(`Account ${accountId} found, but Purchase Order ID ${updatedPurchaseOrder._id} not found in its purchaseOrder array.`);
      // If the element was not found in the array, we cannot recalculate totals correctly.
      // You can choose to return an error or warning here. We'll continue with aggregation but with a warning.
    }

    if (accountArrayReplaceResult.matchedCount > 0) {
      const AccountDetails = await accounModel.findOne({ _id: accountId });
      if (AccountDetails) {
        const depositsValue = AccountDetails?.deposits;
        if (AccountDetails.purchaseOrder.length > 0) {
          console.log(AccountDetails, "AccountDetails");
          
          // 6. Run Aggregation Pipeline on the Account document to recalculate totals and statistics
          const aggregationResult = await accounModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(accountId) } }, // Use ObjectId if accountId is a string
            { $unwind: "$purchaseOrder" }, // Separate array elements into temporary separate documents
            {
              $group: {
                _id: "$_id",
                // Group results back by account ID
                calculatedTotalAmount: { $sum: "$purchaseOrder.amount" }, // Sum total amounts
                calculatedCompleted: { $sum: { $cond: [{ $eq: ["$purchaseOrder.status", "completed"] }, 1, 0] } }, // Count completed operations
                calculatedPending: { $sum: { $cond: [{ $ne: ["$purchaseOrder.status", "completed"] }, 1, 0] } }, // Count pending operations
                calculatedRemainingValue: { $sum: { $cond: [{ $ne: ["$purchaseOrder.status", "completed"] }, "$purchaseOrder.amount", 0] } } // Sum pending operation values
              }
            }
          ]);
          
          console.log(aggregationResult[0], "aggregationResult");
          
          let newTotalAmount = 0;
          let newCompleted = 0;
          let newPending = 0;
          let newRemainingValue = 0;
          let withdrawals = 0;

          if (aggregationResult.length > 0) {
            const result = aggregationResult[0];
            newTotalAmount = result.calculatedTotalAmount;
            newCompleted = result.calculatedCompleted;
            newPending = result.calculatedPending;
            newRemainingValue = result.calculatedRemainingValue;
            withdrawals = result.calculatedTotalAmount;
          } else {
            // This happens if the purchaseOrder array becomes empty
            console.warn(`Aggregation for Account ${accountId} returned no results. Setting totals to 0.`);
          }

          // 7. Update the Account document with the newly calculated aggregate fields
          const updatedAccount = await accounModel.findByIdAndUpdate(
            accountId,
            {
              $set: { // Use $set to set the new (calculated) values
                amount: depositsValue - withdrawals, // Update the 'amount' field with the new total
                // completedOperations: newCompleted, // Update completed operations count
                // pendingOperations: newPending, // Update pending operations count
                // remainingOperationsValue: newRemainingValue, // Update pending operations value
                withdrawals: withdrawals // Update withdrawals (for purchase orders)
              }
            },
            { new: true } // To return the account document after update
          );
          
          console.log(updatedAccount, "updatedAccount");
          // --- End of associated account update logic ---
        }
      }
      
      console.log(updatedPurchaseOrder, "updatedPurchaseOrder");
      
      // 8. Send the final response
      res.status(200).json({
        data: updatedPurchaseOrder,
        success: true,
        message: "Purchase Order and associated Account totals updated successfully."
      });
    } else {
      // If we couldn't match the account (unlikely but possible)
      res.status(200).json({
        data: updatedPurchaseOrder,
        success: true,
        message: "Purchase Order updated successfully, but account update failed."
      });
    }
  } catch (error: any) { // Use any to log the error message
    console.error("Error updating Purchase Order or Account:", error); // Log the error for debugging
    return res.status(400).json({
      message: error.message || "An error occurred during the update.", // Send an appropriate error message
      success: false,
      error: error // You can send the full error object for debugging in development environments
    });
  }
},
  deletePurchaseOrder: async (req: any, res: any) => {
  try {
    const { id } = req.params; // ID of the PurchaseOrderModel document to delete

    // 1. Find the Purchase Order document *before* deleting it to get the accountId
    const purchaseOrderToDelete = await PurchaseOrderModel.findById(id);

    if (!purchaseOrderToDelete) {
      // Purchase Order not found, nothing to delete or update
      return res.status(404).json({
        message: "Purchase Order not found.",
        success: false,
      });
    }

    const accountId = purchaseOrderToDelete.bankAccount; // Get the associated account ID

    // 2. Delete the main PurchaseOrderModel document
    const deleteResult = await PurchaseOrderModel.deleteOne({ _id: id }); // Using deleteOne is more flexible

    if (deleteResult.deletedCount === 0) {
      // This shouldn't happen if found in step 1, but this is a defensive check
      return res.status(500).json({
        message: "Failed to delete Purchase Order document.",
        success: false,
      });
    }

    console.log(`Purchase Order ${id} deleted from PurchaseOrderModel collection.`);

    // --- Start logic for updating the associated account (if accountId exists) ---
    if (accountId) {
      // 3. Find the associated account document
      const account = await accounModel.findById(accountId);

      if (!account) {
        console.error(`Account ${accountId} not found for deleted Purchase Order ID ${id}. Account totals not updated.`);
        // We can continue as the purchase order was deleted, but log the error
      } else {
        // 4. Remove the deleted purchase order from the purchaseOrder array in the Account document
        const pullResult = await accounModel.updateOne(
          { _id: accountId },
          { $pull: { purchaseOrder: { _id: new mongoose.Types.ObjectId(id) } } } // Remove the item matching the deleted purchase order ID
        );

        if (pullResult.modifiedCount === 0) {
          console.warn(`Purchase Order ID ${id} not found in Account ${accountId}'s purchaseOrder array during pull operation.`);
          // This can happen if the item wasn't in the array to begin with.
          // The subsequent aggregation will still work correctly on the remaining items.
        } else {
          console.log(`Purchase Order ID ${id} pulled from Account ${accountId}'s purchaseOrder array.`);
        }

        if (pullResult.matchedCount > 0) {
          const AccountDetails = await accounModel.findOne({ _id: accountId });
          if (AccountDetails) {
            const depositsValue = AccountDetails?.deposits;
            if (AccountDetails.purchaseOrder.length > 0) {
              // 5. Run Aggregation Pipeline on the Account document to recalculate totals and statistics
              const aggregationResult = await accounModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(accountId) } }, // Use ObjectId if accountId is a string
                { $unwind: "$purchaseOrder" }, // Separate array items into temporary separate documents
                {
                  $group: {
                    _id: "$_id",
                    // Group results back by account ID
                    calculatedTotalAmount: { $sum: "$purchaseOrder.amount" }, // Sum total amounts
                    calculatedCompleted: { $sum: { $cond: [{ $eq: ["$purchaseOrder.status", "completed"] }, 1, 0] } }, // Count completed operations
                    calculatedPending: { $sum: { $cond: [{ $ne: ["$purchaseOrder.status", "completed"] }, 1, 0] } }, // Count pending operations
                    calculatedRemainingValue: { $sum: { $cond: [{ $ne: ["$purchaseOrder.status", "completed"] }, "$purchaseOrder.amount", 0] } } // Sum pending operation values
                  }
                }
              ]);
              console.log(aggregationResult, "aggregationResult");
              
              let newTotalAmount = 0;
              let newCompleted = 0;
              let newPending = 0;
              let newRemainingValue = 0;
              let withdrawals = 0;

              if (aggregationResult.length > 0) {
                const result = aggregationResult[0];
                newTotalAmount = result.calculatedTotalAmount;
                newCompleted = result.calculatedCompleted;
                newPending = result.calculatedPending;
                newRemainingValue = result.calculatedRemainingValue;
                withdrawals = result.calculatedTotalAmount;
              } else {
                // This happens if the purchaseOrder array becomes empty (e.g., after deleting all items)
                console.warn(`Aggregation for Account ${accountId} returned no results. Setting totals to 0.`);
              }

              // 6. Update the Account document with the newly calculated aggregate fields
              const updatedAccount = await accounModel.findByIdAndUpdate(
                accountId,
                {
                  $set: { // Use $set to set the new (calculated) values
                    amount: depositsValue - withdrawals, // Update the 'amount' field with the new total
                    // Update pending operations value
                    withdrawals: withdrawals // Update withdrawals
                  }
                },
                { new: true } // To return the updated account document
              );
            } else {
              // If no purchase orders are left, reset relevant fields to 0
              const updatedAccount = await accounModel.findByIdAndUpdate(
                accountId,
                {
                  $set: {
                    amount: depositsValue, // Just deposits since there are no withdrawals
                  
                    withdrawals: 0
                  }
                },
                { new: true }
              );
            }
          }
        } else {
          // This happens if the deleted purchase order wasn't associated with any account
          console.warn(`Deleted Purchase Order ${id} had no accountId. Account totals not updated.`);
        }
        // --- End of associated account update logic ---
      }
    }
    
    // 7. Send final response for the original delete operation
    res.status(200).json({
      message: "Purchase Order deleted successfully.",
      success: true,
    });

  } catch (error: any) { // Use any to log the error message
    console.error("Error deleting Purchase Order or updating Account:", error); // Log the error
    res.status(500).json({ // Appropriate internal server error code
      message: error.message || "An error occurred during the deletion process.",
      success: false,
      error: error // Optional: Include the error object
    });
  }
},

}
export default purchaseOrderController

interface salesOrderType {
  _id: string;
  orderNumber: string;
  amount: number;
  status: string;
}
interface purchaseOrder {
  _id: string;
  orderNumber: string;
  amount: number;
  status: string;
}

interface IAccount {
  name: string;
  amount: number;
  withdrawals: number;
  deposits: number;
  createdAt: Date;
  completedOperations: number;
  pendingOperations: number;
  remainingOperationsValue: number;
  creator: string;
  salesOrder: salesOrderType[],
  purchaseOrder: purchaseOrder[]
}



const addSalesOrderToAccount = async (
  accountId: string,
  data: salesOrderType
): Promise<IAccount | null> => {
  try {
    // Determine if this is a deposit (positive amount) or withdrawal (negative amount)
    // For sales orders, typically money comes IN to the account (deposit)
    const isWithdrawals = true; // Sales orders are typically deposits

    // Find and update the account
    const updatedAccount = await accounModel.findByIdAndUpdate(
      accountId,
      {
        $push: { purchaseOrder: data },
        $inc: {
          // Increment deposits with the sales order amount
          withdrawals: isWithdrawals ? data.amount : 0,
          // Update total amount in account
          amount: -data.amount,
          // Increment completed operations

        }
      },
      { new: true } // Return the updated document
    );

    return updatedAccount;
  } catch (error) {
    console.error('Error adding sales order to account:', error);
    throw error;
  }
};