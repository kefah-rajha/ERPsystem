import { userAuthType } from "../DataType/authType";

import { UserModel } from "../Modal/schemaUser";
import { supplierModel } from "../Modal/schemaSupplier";
import { ProductModel } from "../Modal/schemaProducts"


import mongoose, { Types } from "mongoose";
import { SalesOrderModel } from "../Modal/schemaSalesOrder";
const salesOrder ={
    searchCustomer:async(req:any,res:any)=>{
        try {
            const searchQuery = req.query.name || '';
            
          
            const regex = new RegExp(`^${searchQuery}`, 'i');
            
            const customers = await UserModel.find({ 
                userName: regex,
              role: 'Customer'  // Only search users with customer role
            }).select('userName')
            .populate("contactID", "phone postCode city street email")
            .limit(5)
            .exec();
            console.log(customers)
            
            return res.status(200).json({
                data: customers,
                success: true,
              });
            
          } catch (error) {
            return res.status(500).json({
                message: error,
                success: false,
              });
          }

    },
    searchSupplier:async(req:any,res:any)=>{
      try {
          const searchQuery = req.query.name || '';
          
          // Create a case-insensitive regular expression for name search
          const regex = new RegExp(`^${searchQuery}`, 'i');
          const SearchQueries=[
            { 
              $or: [
                { $expr: { 
                  $regexMatch: { 
                    input: { $concat: ['$firstName', ' ', '$lastName'] }, 
                    regex: new RegExp(regex, 'i') 
                  } 
                }}
              ]
            }
          
          ]
          
          const supplier = await supplierModel.find({ 
            $or: SearchQueries
           
          })
          .select('firstName lastName')
          .limit(5)
          .exec();
          console.log(supplier)
          
          return res.status(200).json({
              data: supplier,
              success: true,
            });
          
        } catch (error) {
          return res.status(500).json({
              message: error,
              success: false,
            });
        }

  },
  searchProductSalesOrder :async(req :any , res :any)=>{
    const {  fieldSearch, searchInput } = req.body;   
    const searchQuery = {
      [fieldSearch]: { 
        $regex: new RegExp(searchInput, 'i') 
      }
    };
    console.log(searchQuery)

    try{
      const products = await ProductModel.find(searchQuery)
      .limit(5)
      console.log(products)
      return res.status(200).json({
        data: products,
        success: true,
      });

    }catch (error: unknown) {
      return res.status(500).json({
        message: error,
        success: false,
      });
    }

  },
  createSalesOrder :async(req :any , res :any)=>{
    try{
      const data = req.body;
    console.log(data?.values ,"data?.values")

      const order = new SalesOrderModel({
        orderNumber: `SO-${Date.now()}`,
        customer: {
          userName: data?.values.customer,
          shipmentAddress: data?.values.shipmentAddress,
          phone:  data?.values.phone,
          customerEmail:data?.values.customerEmail
        },
        supplier: {
          name: data?.values.supplier
        },
        items: data.items,
        netTotal: data?.values.netAmount,
        totalVat: data?.values.vatAmount,
        totalAmount:data?.values.totalAmount,
        vatRate:data?.values.vatRate,
        includeVat:data?.values.includeVat,
        currency:data?.values.currency,
        paymentTerm: data?.values.paymentTerm
      });
      const saveOrder=await order.save();
      console.log(saveOrder)
      if(saveOrder){
        return res.status(200).json({
          data: saveOrder,
          success: true,
        });
      }


    }catch (error: unknown) {
      console.log(error)
      return res.status(500).json({
        message: error,
        success: false,
      });
    }
  }
  ,
   getSalesOrders:async (req :any, res:any) => {
    try {
      
      const { from, to, page = 1, limit = 10 } = req.query;
      console.log(from, to, page , limit )
  
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
      const totalOrders = await SalesOrderModel.countDocuments({
        createdAt: { 
          $gte: fromDate,
          $lte: toDate
        }
      });
  
      // Retrieve paginated Sales Orders
      const salesOrders = await SalesOrderModel.find({
        createdAt: { 
          $gte: fromDate,
          $lte: toDate
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("items.product","name _id price");
  
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
  
    } catch (error:unknown) {
      res.status(500).json({ 
        message: 'Error retrieving sales orders',
        error: error
      });
    }
  },
  deleteSalesOrder: async (req: any, res: any) => {
    try {
      const { id } = req.params;
    

      const saleOrderDelete = await SalesOrderModel.findByIdAndDelete(id);
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
  UpdateSaleOrder:async(req:any,res :any)=>{
    try {

      const { id } =  req.params;
      console.log(id,"test")

      const resSaleOrder = await SalesOrderModel.findById( id ).populate("items.product");
     
      res.status(200).json({
        posts: resSaleOrder,
        success: true,
      })

    } catch (error) {
      return res.status(400).json({
        message: error,
        success: false,
      });
    }

  },
  updateSalesOrder:async (req: any, res: any) => {
    try {
const { id } = req.params;
      const data = req.body
      const UpdateData= await  SalesOrderModel.findByIdAndUpdate(id ,data,{new:true})
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

}
export default salesOrder