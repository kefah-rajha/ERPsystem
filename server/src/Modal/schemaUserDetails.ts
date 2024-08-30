
import { Schema, model, connect } from 'mongoose';

// models/User.ts
interface UserDetails {
    userId:string;
    name:string;
    phone:string;
    brithday:string,
    
}

const UserDetailsSchema = new Schema<UserDetails>({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true ,default:"" },
    brithday: { type: String ,default:""},
   


});

export const UserDetailsModel = model<UserDetails>('UserDetails', UserDetailsSchema);