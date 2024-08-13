
import { Schema, model, connect } from 'mongoose';

// models/User.ts
interface User {
    userName:string
    password: string;
}

const userSchema = new Schema<User>({
    userName: { type: String, required: true },
    password: { type: String, required: true },
});

export const UserModel = model<User>('User', userSchema);