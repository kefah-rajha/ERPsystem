
import { Schema, model, connect } from 'mongoose';

// models/User.ts
interface User {
    userName:string
    password: string;
    name:string;
    Brithday:string;
}

const userSchema = new Schema<User>({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    name:{ type: String},
    Brithday:{type:String}

});

export const UserModel = model<User>('User', userSchema);