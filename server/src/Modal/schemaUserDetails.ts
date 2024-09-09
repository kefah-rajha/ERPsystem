
import { Schema, model, connect } from 'mongoose';

// models/User.ts
interface UserDetails {
    userId:string;
    phone: string;
    email: string;
    address: string;
    website: string;
    postCode: string;
    city: string;
    street: string;
    
}

const UserDetailsSchema = new Schema<UserDetails>({
    userId:  String ,
    email: String,
    address: String ,
    phone:   String,
    website:  String ,
    postCode: { type: String },
    city: { type: String },
    street: { type: String },


});

export const UserDetailsModel = model<UserDetails>('contactInfo', UserDetailsSchema);