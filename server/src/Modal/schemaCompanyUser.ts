
import { Schema, model, connect } from 'mongoose';

// models/User.ts
interface UserCompany {
    userId:string;
    nameCompany:string;
    phone: string;
    email: string;
    address: string;
    website: string;
    postCode: string;
    city: string;
    street: string;
    
}

const UserCompanySchema = new Schema<UserCompany>({
    userId: { type: String },
    nameCompany:{type:String},
    email:{ type: String},
    address: { type: String },
    phone: { type: String,unique:false},
    website: { type: String },
    postCode: { type: String },
    city: { type: String },
    street: { type: String },


});

export const   UserCompanyModel = model<UserCompany>('Usercompany', UserCompanySchema);