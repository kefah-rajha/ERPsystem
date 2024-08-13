import { UserDetailsModel } from "../Modal/schemaUserDetails"
import jwt from "jsonwebtoken"
import { UserDetailsType } from "../DataType/userType"
import { Types } from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

export const user = {
    updateUser: async (req: any, res: any) => {
        try {
            console.log(req.body)

            const { userId, name, phone, brithday, languag } =
                req.body as UserDetailsType;
            const user_id = await UserDetailsModel.findOne({ userId });


            if (!user_id) {
                return res.status(400).json({ err: "the user is not exist" });
            } else {
                const updateData = req.body as UserDetailsType;
                const userAfterUpdat = await UserDetailsModel.findOneAndUpdate({ userId }, updateData, { new: true }); // Return updated user

                return res.status(200).json({
                    userAfterUpdat,
                    success: true,
                });

            }
        } catch (error: any) {
            res.status(402).json(error.message as string);
        }
    }
}
