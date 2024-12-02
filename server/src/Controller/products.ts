import { Types } from 'mongoose';
import { ProductModel } from "../Modal/schemaProducts"
export const products = {
  getProduct: async (req: any, res: any) => {
    try {

      const { id } =  req.params;
      console.log(id,"test")

      const resPost = await ProductModel.findById( id )
     
      res.status(200).json({
        posts: resPost,
        success: true,
      })

    } catch (error) {
      return res.status(400).json({
        message: error,
        success: false,
      });
    }

  },
  getAllProducts: async (req: any, res: any) => {
    console.log("test")

    try {
      const { pageNumber } = req.params;
      const resallPost = await ProductModel.find().sort({
        createdAt: -1
      })
      console.log(resallPost)

      res.status(200).json({
        allposts: resallPost
      })

    } catch (error) {
      return res.status(400).json({
        message: error,
        success: false,
      });
    }
  },
  createProduct: async (req: any, res: any) => {
    try {
      const data = req.body
      console.log(data)

      const newProduct = new ProductModel(
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
      const { id } = req.params;
      console.log(id)

      const productDelete = await ProductModel.findByIdAndDelete(id);
      console.log(productDelete)
      res.status(200).json({
        ID: productDelete?._id,
        message: "ok"
      })
    } catch (err: unknown) {
      console.log(err)

    }


  },
  updateProduct :async (req: any, res: any) => {
    try {
console.log("update")
      const data = req.body
      const UpdateData= await  ProductModel.findByIdAndUpdate(data.id ,data,{new:true})
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
