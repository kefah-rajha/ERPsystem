
import { Schema, model, connect } from 'mongoose';

// models/User.ts
interface UserDetails {
    userId:string;
    name:string;
    phone:string;
    brithday:string,
    languag:string
}

const UserDetailsSchema = new Schema<UserDetails>({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true ,default:"" },
    brithday: { type: String ,default:""},
    languag: { type: String ,default: "en"},


});

export const UserDetailsModel = model<UserDetails>('UserDetails', UserDetailsSchema);