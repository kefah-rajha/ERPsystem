
import { supplierModel } from "../Modal/schemaSupplier";

import { Types } from "mongoose";
import dotenv from "dotenv";
dotenv.config();



export const supplier = {
  getAllSupplier: async (req: any, res: any) => {
    try {
      const pageNumber = parseInt(req.params.pageNumber as string) || 1;
      const pageSize = parseInt(req.params.pageSize as string) || 10;
      const skipItems = (pageNumber - 1) * pageSize;
  
      const { fieldSort, sort, fields, fieldSearch, searchInput, dateRange } = req.body;
      console.log(fieldSort, sort, fields, fieldSearch, searchInput);
  
      // Simple case: no filters applied
      if (fields === "All" && searchInput === "" && sort === "1" && 
          (!dateRange || (dateRange.startDate === "" && dateRange.endDate === ""))) {
        console.log("No filters applied - using simple find");
        
        const suppliers = await supplierModel.find({})
          .skip(skipItems)
          .limit(pageSize);
        
        return res.status(200).json({
          success: true,
          data: suppliers,
          message: 'Suppliers retrieved successfully'
        });
      } else {
        // Build the query with filters
        const query: any = {};
        
        // Add date range filter if specified
        if (dateRange) {
          if (dateRange.startDate || dateRange.endDate) {
            query.createdAt = query.createdAt || {};
  
            if (dateRange.startDate) {
              query.createdAt.$gte = new Date(dateRange.startDate);
            } else {
              query.createdAt.$gte = new Date('1970-01-01');
            }
  
            if (dateRange.endDate) {
              query.createdAt.$lte = new Date(dateRange.endDate);
            } else {
              query.createdAt.$lte = new Date();
            }
          }
        }
  
        // Add search filter if search input exists
        if (searchInput) {
          if (fieldSearch) {
            // If specific field is provided, search only in that field
            query[fieldSearch as string] = { $regex: searchInput, $options: 'i' };
          } else {
            // If no field is specified, default to searching by first name
            query.firstName = { $regex: searchInput, $options: 'i' };
          }
        }
  
        // Add empty/non-empty fields filter
        if (fields === "Empty") {
          query.$or = [
            { firstName: { $eq: '' } },
            { lastName: { $eq: '' } },
            { email: { $eq: '' } },
            { companyName: { $eq: '' } },
            { phone: { $eq: '' } },
            { address: { $eq: '' } },
          ];
        } 
  
        // Build sort options
        const sortOptions: Record<string, 1 | -1> = {};
        if (fieldSort) {
          sortOptions[fieldSort] = sort === '1' ? 1 : -1;
        }
  
        console.log("Query:", query);
        console.log("Sort:", sortOptions);
        
        // Execute query with filters and sorting
        const suppliers = await supplierModel
          .find(query)
          .sort(sortOptions)
          .skip(skipItems)
          .limit(pageSize)
          .lean();
        
        return res.status(200).json({
          success: true,
          data: suppliers,
          message: 'Suppliers retrieved successfully'
        });
      }
    } catch (error: unknown) {
      console.error("Error in getAllSupplier:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "An unknown error occurred",
        success: false,
      });
    }
  },
    getSupplier:async (req: any, res: any) => {
        const userId = req.params.id;
    
        const getDataSupplier = await supplierModel.findOne({ _id: userId });
        console.log(getDataSupplier, "getDataUSer");
        if (!getDataSupplier) {
          return res.status(400).json({
            success: false,
          });
        } else {
          return res.status(200).json({
            data: getDataSupplier,
            success: true,
          });
        }
      },
    createSupplier: async (req: any, res: any) => {
        try {
            console.log(req.body);

            const { firstName,
                lastName,
                email,
                website,
                companyName,
                defaultTax,
                phone,
                mailingAddress,
                postCodeMiling,
                cityMiling,
                streetMiling,
                mailingCountry,
                address,
                postCode,
                city,
                street,
                country } = req.body;

            const supplierEmail = await supplierModel.findOne({ email: email });

            if (supplierEmail) {
                return res.status(400).json({
                    success: false,
                    message: "The supplier's Email Is Exist ,Choose A Unique Email",
                });
            } else {
                const finalSupplier = new supplierModel({
                    firstName,
                    lastName,
                    email,
                    website,
                    companyName,
                    defaultTax,
                    phone,
                    mailingAddress,
                    postCodeMiling,
                    cityMiling,
                    streetMiling,
                    mailingCountry,
                    address,
                    postCode,
                    city,
                    street,
                    country 
                });
                console.log(finalSupplier, "finaluser");

                const supplierInfo = await finalSupplier.save();
                if (!supplierInfo) {
                    return res.status(400).json({
                        success: false,
                        message: "uh, there is thing, try later",
                    });
                }
console.log(supplierInfo,"supplierInfo")
                return res.status(200).json({
                    data: supplierInfo,
                    success: true,
                });
            }
        } catch (error: any) {
            res.status(402).json({
                message: error.message as string,
                success: false,
            });
        }
    },
    updateSupplier:async (req: any, res: any) => {
        try {
    console.log("update")
    const { id } = req.params;
          const data = req.body
          const UpdateData= await  supplierModel.findByIdAndUpdate(id ,data,{new:true})
          return res.status(200).json({
            data: UpdateData,
            success: true,
          });
        } catch (error: unknown) {
          return res.status(400).json({
            message: error,
            success: false,
          });
        }
    
      },
    deleteSupplier: async (req: any, res: any) => {
        try {
          const { id } = req.params;
        
    
          const supplierDelete = await supplierModel.findByIdAndDelete(id);
          console.log(supplierDelete)
          if (supplierDelete?._id) {
           
            res.status(200).json({
              message: "delete supplier is done",
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
};
