import { Types } from 'mongoose';
import { ProductModel } from "../Modal/schemaProducts"
export const products = {
    ceateProduct:async(req:any, res:any)=>{
        try {
        
            const data = req.body
            const newProduct= new ProductModel(
            data
              )
          
             await newProduct.save();
            return res.status(200).json({
                data: data,
                success: true,
            });
        } catch (error: unknown) {
            return res.status(400).json({
                message: error,
                success: false,
            });
        }

    }
}
