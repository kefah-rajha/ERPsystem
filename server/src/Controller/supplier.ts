
import { supplierModel } from "../Modal/schemaSupplier";

import { Types } from "mongoose";
import dotenv from "dotenv";
dotenv.config();



export const supplier = {
    getAllSupplier: async (req: any, res: any) => {
        try {
            const { pageNumber } = req.params;
            console.log(pageNumber)
            const { fieldSort, sort,  fields, fieldSearch, searchInput } = req.body;
            const sortAsNumber = sort == "1" ? 1 : -1
            const regex = searchInput == "" ? new RegExp(/^[a-zA-Z0-9]+$/) : new RegExp(`^${searchInput}`, 'i')
            console.log(regex, "regex")
            const search = {
                $match: {
                    [fieldSearch]: { $regex: regex }
                }
            }
        
            const SortAlphaB = {
                $sort: {
                    [fieldSort]: sortAsNumber

                }
            }
            const EmptyFields = {
                $match: {
                    $or: [
                      
                        { "lastName": "" },
                        { "firstName": "" },
                        { "email": "" },
                        { "companyName": "" },
                        { "phone": "" },
                        { "address": "" },

                    ]
                }
            }
            const pipeline: any = [ ]

            if (fields !== "Empty") {

                const recallPost = await supplierModel.aggregate([...pipeline, search, SortAlphaB])
                console.log(recallPost)
                return res.status(200).json({
                    data: recallPost,
                    success: true,
                });
            } else if (fields == "Empty" ) {

                const recallPost = await supplierModel.aggregate([...pipeline, search, EmptyFields,
                     SortAlphaB

                ])
                return res.status(200).json({
                    data: recallPost,
                    success: true,
                });

            } 


        } catch (error: unknown) {
            return res.status(200).json({
                message: error,
                success: true,
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
