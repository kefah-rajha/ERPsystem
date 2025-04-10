import { Types } from 'mongoose';
import { ProductModel } from "../Modal/schemaProducts"
import { Request, Response } from 'express';
import mongoose from 'mongoose';
export const products = {
   getProduct: async (req: Request, res: Response) => {
    try {
      // Extract product ID from request parameters
      const { id } = req.params;
  
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: 'Invalid product ID format',
          success: false,
        });
      }
  
      // Find product and populate categories and subcategories
      const product = await ProductModel.findById(id)
        .populate('categories') // Populate main category
        .populate('subCategories') // Populate subcategories
        .lean(); // Convert to plain JavaScript object
        console.log(product,"product")
  
      // Check if product exists
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
          success: false,
        });
      }
  
      
  
      // Send successful response
      res.status(200).json({
        product: product,
        success: true,
        message: 'Product retrieved successfully',
      });
  
    } catch (error) {
      // Enhanced error handling
      console.error('Error in getProduct:', error);
      
      // Type the error for better handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return res.status(500).json({
        message: 'Server error while retrieving product',
        error: errorMessage,
        success: false,
      });
    }
  },
  getAllProducts: async (req: Request, res: Response) => {
    console.log("test")

    try {

      const pageNumber = parseInt(req.params.pageNumber as string) || 1;
      const pageSize = parseInt(req.params.pageSize as string) || 10;
      const skipItems = (pageNumber - 1) * pageSize;
      const {
        fieldSort,
        sort,
        fields,
        fieldSearch,
        searchInput,
        selectedBrands,
        selectedCategory,
        supplierName,
        inStock,
        priceRange,
        dateRange
      } = req.body;

      // Build filter query
      const query: any = {};
      if (searchInput) {
        if (fieldSearch) {
          // If specific field is provided, search only in that field
          query[fieldSearch as string] = { $regex: searchInput, $options: 'i' };
        } else {
          // If no field is specified, default to searching by name only
          query.name = { $regex: searchInput, $options: 'i' };
        }
      }
      console.log(inStock == false,"inStock")

      if (inStock == "true") {
        // Get products with stock greater than 0
        console.log(true,"inStock")

        query.stock = { $gt: 0 };
      } 
       if(inStock == "false") {
        // Get products with stock equal to 0
        console.log(false,"inStock")

        query.stock = 0;
      }



      if (selectedBrands !== "All") {
        // Get products with stock greater than 0
        query.brandName = selectedBrands;
      } 
      if (selectedCategory !== null) {
        query.$or = [
          { categories: selectedCategory },
          { subCategories: selectedCategory }
        ];
      } 
       

      // Price range filter
     
      if (priceRange.min || priceRange.max) {
        query.price = {};
        if (priceRange.min) query.price.$gte = parseFloat(priceRange.min as string);
        if (priceRange.max) query.price.$lte = parseFloat(priceRange.max as string);
      }

      // Creation date filter
      if (dateRange.startDate || dateRange.endDate) {
        query.createdAt = {};
        if (dateRange.startDate) {
          query.createdAt.$gte = new Date(dateRange.startDate as string);
        }
        if (dateRange.endDate) {
          query.createdAt.$lte = new Date(dateRange.endDate as string);
        }
      }


      // Apply sorting
      const sortOptions: any = {};
      sortOptions[fieldSort as string] = sort === 'asc' ? 1 : -1;
      console.log(query)
      // Get products
      const products = await ProductModel
        .find(query)
        .sort(sortOptions)
        .skip(skipItems)
        .limit(pageSize)
      console.log(query)
      const priceStats = await ProductModel.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: { $toDouble: "$price" } },
            maxPrice: { $max: { $toDouble: "$price" } }
          }
        }
      ]);
      const suppliers = await ProductModel.distinct('SupplierName');
      const brand = await ProductModel.distinct('brandName');



      console.log(suppliers)

      // Send response
      res.status(200).json({
        success: true,
        data: {
          products,

          appliedFilters: {
            priceStats,
            suppliers,
             brand,
            
            // maxPrice,
            // searchTerm
          }
        }
      });



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
      console.log(data, "data")
      if (data.price) {
        data.price = parseFloat(data.price);
      }
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
  updateProduct: async (req: any, res: any) => {
    try {
      console.log("update")
      const data = req.body
      const UpdateData = await ProductModel.findByIdAndUpdate(data.id, data, { new: true })
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
  getNumberProducts: async (req: any, res: any) => {
    try {

      const totalCount = await ProductModel.countDocuments();
      return res.status(200).json({
        data: totalCount,
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
