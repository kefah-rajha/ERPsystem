import { UserModel } from "../Modal/schemaUser";
import jwt from "jsonwebtoken";
import { userAuthType } from "../DataType/authType";
import { Types } from "mongoose";
import dotenv from "dotenv";
import { UserDetailsModel } from "../Modal/schemaUserDetails";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  AccessTokenPayload
} from '../utils/jwt';
dotenv.config();
const sendRefreshTokenCookie = (res: any, refreshToken: string) => {
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  res.cookie('jid', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: maxAge
  });
};

export const auth = {
  SignUpFun: async (req: any, res: any) => {
    try {
      console.log(req.body);

      const { userName, password } = req.body as userAuthType;

      const newusername = userName.toLowerCase().replace(/ /g, "");
      const user_name = await UserModel.findOne({ userName: newusername });


      if (user_name) {
        return res.status(400).json({
          success: false,
          message: "The User Name Is Exist ,Choose A Unique Username",
        });
      } else {
        const finalUser = new UserModel({
          userName: newusername,
          password,
          name: "",
          Brithday: ""
        });
        console.log(finalUser, "finalUser");

        const userInfo = await finalUser.save();
        if (!userInfo) {

          return res.status(400).json({
            success: false,
            message: "uh, there is thing, try later",
          });

        }
        const userJWT = {
          _id: userInfo._id.toString(),
          userName: userInfo.userName,
          role: userInfo.role
        }

        const accessToken = generateAccessToken(userJWT);
        const refreshToken = generateRefreshToken(userJWT);
        await UserModel.updateOne({ _id: userInfo._id }, { $set: { refreshToken: refreshToken } });

        sendRefreshTokenCookie(res, refreshToken);


        return res.status(200).json({
          refreshToken,
          
          success: true,
        });
      }
    } catch (error: any) {
      res.status(402).json({
        message: error.message as string,
        success: false,
      });
    }
  },
  login: async (req: any, res: any) => {
    console.log(req.body);

    try {
      const { password, userName } = req.body as userAuthType;
      //make all user name lowerCase
      const newusername = userName.toLowerCase().replace(/ /g, "");
      const user_name = await UserModel.findOne({ userName: newusername });

      if (!user_name) {
        res.status(400).json({
          success: false,
          message: "the user name name isnt exist"
        });
      } else {

        if (password !== user_name?.password) {
          res.status(400).json({
            success: false,
            message: "the password isnt True"
          });
        }
        const userJWT = {
          _id: user_name._id.toString(),
          userName: user_name.userName,
          role: user_name.role
        }
        const accessToken = generateAccessToken(userJWT);
        const refreshToken = generateRefreshToken(userJWT);
        await UserModel.updateOne({ _id: user_name._id }, { $set: { refreshToken: refreshToken } });

        sendRefreshTokenCookie(res, refreshToken);
        return res.status(200).json({
          refreshToken,
          
          success: true,
        });}
    } catch (error: any) {
      res.status(402).json({
        message: error.message as string,
        success: false,
      });
    }
  },
  // i am working on this
  getauth: async (req: any, res: any) => {
    const token = req.cookies.jid;

    if (!token) {
      return res.status(401).json({ accessToken: '', message: 'No refresh token cookie' });
    }

    let payload: ReturnType<typeof verifyRefreshToken> = null;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      console.error("Refresh Token Verification Error:", err);
      return res.status(401).json({ accessToken: '', message: 'Invalid refresh token' });
    }

    if (!payload || !payload.userId) {
      return res.status(401).json({ accessToken: '', message: 'Invalid refresh token payload' });
    }

    const user = await UserModel.findById(payload.userId).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      res.clearCookie('jid', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
      return res.status(401).json({ accessToken: '', message: 'Refresh token mismatch or user not found' });
    }
    const userJWT = {
      _id: user._id.toString(),
      userName: user.userName,
      role: user.role
    }
    const newAccessToken = generateAccessToken(userJWT);
    const newRefreshToken = generateRefreshToken(userJWT);

    user.refreshToken = newRefreshToken;
    const userAfterSaveToken = await user.save();
    console.log(userAfterSaveToken,"userAfterSaveToken")

    sendRefreshTokenCookie(res, newRefreshToken);

    
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: userAfterSaveToken
    });




  },
  logout: async (req: any, res: any) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    try {
      await UserModel.updateOne({ _id: userId }, { $unset: { refreshToken: "" } });

      res.clearCookie('jid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return res.status(200).json({ message: 'Logout successful' });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

