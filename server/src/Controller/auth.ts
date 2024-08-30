import { UserModel } from "../Modal/schemaUser";
import jwt from "jsonwebtoken";
import { userAuthType } from "../DataType/authType";
import { Types } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

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
        const finaluser = new UserModel({
          userName: newusername,
          password,
          name:"",
          brithday:""
        });
        console.log(finaluser, "finaluser");
        
        await finaluser.save();

        const create_token = createAccessToken({ id: finaluser._id });
        const refreash_token = createRefreashToken({ id: finaluser._id });
        res.cookie("refreash_token", refreash_token, {
          httpOnly: true,
          secure: true,
          SameSite: "none",
          path: "api/authorization",
          maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          refreash_token,
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

      if (!user_name ) {
        res.status(400).json({  success: false,
          message: "the user name name isnt exist" });
      } else {

        if(password !== user_name?.password ){
           res.status(400).json({ success: false,
            message: "the password isnt True" });}

        const create_token = createAccessToken({ id: user_name?._id });
        const refreash_token = createRefreashToken({ id: user_name?._id });
        res.cookie("refreash_token", refreash_token, {
          httpOnly: true,
          secure: true,
          path: "api/authorization",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
        });

        return res
          .status(200)
          .json({ success: true, user: user_name, refreash_token});
      }
    } catch (error: any) {
      res.status(402).json({
        message: error.message as string,
        success: false,
      });
    }
  },
  // i am working on this
  getauth: async (req: any, res: any) => {
    const token = req.cookies.refreash_token;

    // const data = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    // const userToken = await UserModel.findById(data.id as Types.ObjectId).select("-password");
    // if (!userToken) res.status(403).json({ message: "this is not exist" });
    // const accessToken = createAccessToken({ id: data.id });
    // return res.status(200).json({
    //   token: accessToken,
    //   user: userToken,
    // });
  },
  logout: async (req: any, res: any) => {
    try {
      res.clearCookie("refreshtoken", { path: "api/authorization" });
      return res.json({ msg: "Logged out!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
const createAccessToken = (paylod: any) => {
  return jwt.sign(paylod, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "10d",
  });
};
const createRefreashToken = (paylod: any) => {
  console.log(process.env.REFRES_TOKEN_SECRET, process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(paylod, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
};
