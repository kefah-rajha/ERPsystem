
import { Schema, model, connect } from 'mongoose';

// models/User.ts
export interface User {
    userName:string
    password: string;
    name:string;
    Brithday:Date;
    createdAt: Date,
    role:string,
    refreshToken?: string;
    companyID:Schema.Types.ObjectId,
    contactID:Schema.Types.ObjectId

}

const userSchema = new Schema<User>({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    name:{ type: String},
    Brithday:{type:Date,default:new Date()},
    role:{type:String,default:"Customer"},
    createdAt:{type:Date,default:new Date()},
    companyID:{type:Schema.Types.ObjectId,ref:"Usercompany"},
    contactID:{type:Schema.Types.ObjectId,ref:"contactInfo"},
    refreshToken: { type: String, select: false }




});

export const UserModel = model<User>('User', userSchema);