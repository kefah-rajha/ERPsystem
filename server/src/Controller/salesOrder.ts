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

      const order = new SalesOrderModel({
        orderNumber: `SO-${Date.now()}`,
        customer: {
          name: 'John Doe',
          contact: 'john@example.com',
          phone: '1234567890'
        },
        salesStaff: {
          name: 'Jane Smith',
          code: 'SS001'
        },
        items: [{
          product: new mongoose.Types.ObjectId('product_id_here'),
          quantity: 2,
          vat: 0.2,
          vatAmount: 20,
          totalAmount: 120
        }],
        subtotal: 100,
        totalVat: 20,
        grandTotal: 120
      });
      const saveOrder=await order.save();
      if(saveOrder){
        return res.status(200).json({
          data: saveOrder,
          success: true,
        });
      }


    }catch (error: unknown) {
      return res.status(500).json({
        message: error,
        success: false,
      });
    }
  }

}
export default salesOrder