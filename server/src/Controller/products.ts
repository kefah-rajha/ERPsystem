import { Types } from 'mongoose';
import { ProductModel } from "../Modal/schemaProducts"
export const products = {
    getAllProducts: async (req: any, res: any) => {
        console.log("test")

        try {
          const { pageNumber} =  req.params;
          const resallPost = await ProductModel.find().sort({
            createdAt: -1
          })
          console.log(resallPost)
    
          res.status(200).json({
            allposts: resallPost
          })
    
        } catch (error) {
          console.log(error)
        }
      },
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

    },
    deleteProduct: async (req: any, res: any) => {
        try {
          const { id } =  req.params;
          console.log(id)
    
          const productDelete = await ProductModel.findByIdAndDelete(id);
          console.log(productDelete)
          res.status(200).json({
            ID:productDelete?._id,
            message: "ok"
          })
        } catch (err: unknown) {
          console.log(err)
    
        }
    
    
      }
}
