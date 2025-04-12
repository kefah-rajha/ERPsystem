
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
   
  },
  mainPhoto: {
    type: String,
  },

});

export const ProductModel = model<Product>('Products', productSchema);