
import { Schema, model, connect } from 'mongoose';

// models/User.ts
interface Supplier {

    createdAt: Date,

    firstName: string;
    lastName: string;
    email: string;
    website: string;
    companyName: string;
    defaultTax: string;
    phone: string;
    mailingAddress: string;
    postCodeMiling: string;
    cityMiling: string;
    streetMiling: string;
    mailingCountry: string;
    address: string;
    postCode: string;
    city: string;
    street: string;
    country: string
}

const supplierSchema = new Schema<Supplier>({
    createdAt: { type: Date, default: new Date() },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    website: { type: String },
    companyName: { type: String },
    defaultTax: { type: String },
    phone: { type: String },
    mailingAddress: { type: String },
    postCodeMiling: { type: String },
    cityMiling: { type: String },
    streetMiling: { type: String },
    mailingCountry: { type: String },
    address: { type: String },
    postCode: { type: String },
    city: { type: String },
    street: { type: String },
    country :{ type: String },
    
});
export const supplierModel = model<Supplier>('Supplier', supplierSchema);

supplierModel.collection.createIndex({ firstName: 1 });
supplierModel.collection.createIndex({ lastName: 1 });