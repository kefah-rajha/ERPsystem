
import mongoose, { Schema, model, connect } from 'mongoose';

// models/User.ts

interface Product {
  name: string;
  SKU: string;
  brandName: string;
  productTag: string;
  price: number;
  Discount: string;
  stock: string,
  SupplierName: string;
  salesCode: string;
  purchaseCode: string;
  supplierCode: string;
  trackInventory: boolean;
  allowOutOfStock: boolean;
  Description: string;
  vat: string;
  Status: string;
  categories: Schema.Types.ObjectId;
  subCategories: string[];
  photos:string [];
  mainPhoto:string;
}
const attributes = new mongoose.Schema({
  properties: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,

    default: {},
  },
});
const productSchema = new Schema<Product>({
  name: { type: String },
  SKU: { type: String },
  brandName: { type: String },
  productTag: { type: String },
  price: { type: Number },
  Discount: { type: String },
  SupplierName: { type: String },
  salesCode: { type: String },
  purchaseCode: { type: String },
  supplierCode: { type: String },
  trackInventory: { type: Boolean },
  allowOutOfStock: { type: Boolean },
  Description: { type: String },
  stock: { type: String },
  vat: { type: String },
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  Status: {
    type: String,
    enum: ["archive", "published", "draft"],
    default: 'published'
  },
  photos: {
    type: [String],
    default: [
      'https://png.pngtree.com/png-vector/20210602/ourlarge/pngtree-3d-beauty-cosmetics-product-design-png-image_3350323.jpg',
      'https://png.pngtree.com/png-vector/20210602/ourlarge/pngtree-3d-beauty-cosmetics-product-design-png-image_3350323.jpg',
      'https://png.pngtree.com/png-vector/20210602/ourlarge/pngtree-3d-beauty-cosmetics-product-design-png-image_3350323.jpg',
      'https://png.pngtree.com/png-vector/20210602/ourlarge/pngtree-3d-beauty-cosmetics-product-design-png-image_3350323.jpg',
    ],
  },
  mainPhoto: {
    type: String,
    default: 'https://mediaphic.com/wp-content/uploads/2021/02/%D9%86%D9%85%D9%88%D8%B0%D8%AC-%D8%B5%D9%88%D8%B1%D8%A9-%D9%85%D9%86%D8%AA%D8%AC-2.jpg',
  },

});

export const ProductModel = model<Product>('Products', productSchema);