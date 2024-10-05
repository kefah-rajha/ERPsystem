
import { Schema, model, connect } from 'mongoose';

// models/User.ts
interface User {
    userName:string
    password: string;
    name:string;
    Brithday:string;
    createdAt: Date,
    role:string,
    companyID:Schema.Types.ObjectId,
    contactID:Schema.Types.ObjectId

}

const userSchema = new Schema<User>({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    name:{ type: String},
    Brithday:{type:String},
    role:{type:String,default:"Customer"},
    createdAt:{type:Date,default:new Date()},
    companyID:{type:Schema.Types.ObjectId,ref:"Usercompany"},
    contactID:{type:Schema.Types.ObjectId,ref:"contactInfo"},




});

export const UserModel = model<User>('User', userSchema);