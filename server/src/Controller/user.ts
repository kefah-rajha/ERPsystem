import { UserDetailsModel } from "../Modal/schemaUserDetails";

import jwt from "jsonwebtoken";
import { UserinfoType } from "../DataType/userType";
import { userContactInfo } from "../DataType/userType";
import { userCompanyInfo } from "../DataType/userType";
import { UserCompanyModel } from "../Modal/schemaCompanyUser";
import { userAuthType } from "../DataType/authType";

import { UserModel } from "../Modal/schemaUser";

import { Types } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const user = {
  getAllUsers: async (req: any, res: any) => {
    try {
      const { pageNumber } = req.params;
      const resallPost = await UserModel.find().sort({
        createdAt: -1,
      });
      return res.status(200).json({
        data: resallPost,
        success: true,
      });
    } catch (error: unknown) {
      return res.status(200).json({
        message: error,
        success: true,
      });
    }
  },
  getNumberUsers: async (req: any, res: any) => {
    console.log("scscsc");
    UserModel.countDocuments()
      .then((count) => {
        console.log(count);
        res.status(200).json({
          data: count,
          success: true,
        });
      })
      .catch((err) => {
        return res.status(200).json({
          message: err,
          success: true,
        });
      });
  },
  updateContactInfoUser: async (req: any, res: any) => {
    try {
      const userId = req.params.id;
      const { phone, email, address, website, postCode, city, street } =
        req.body as userContactInfo;
      console.log(userId);

      const getDataUSer = await UserDetailsModel.findOne({ userId: userId });

      if (getDataUSer == null) {
        const contactInfoUser = new UserDetailsModel({
          userId: userId,
          phone,
          email,
          address,
          website,
          postCode,
          city,
          street,
        });
        await contactInfoUser.save();
        return res.status(200).json({
          message: "Update Is Done",
          success: true,
        });
      } else {
        const userAfterUpdat = await UserDetailsModel.findOneAndUpdate(
          { userId: userId },
          {
            phone,
            email,
            address,
            website,
            postCode,
            city,
            street,
          },
          { new: true }
        ); // Return updated user
        if (userAfterUpdat == null) {
          return res.status(400).json({
            message: "This user Is'nt Exist",
            success: false,
          });
        } else {
          return res.status(200).json({
            message: "Update Is Done",
            success: true,
          });
        }
      }
    } catch (error: any) {
      res.status(402).json(error.message as string);
    }
  },
  getProfileInfoUser: async (req: any, res: any) => {
    const userId = req.params.id;

    const getDataUSer = await UserModel.findOne({ _id: userId });
    console.log(getDataUSer, "getDataUSer");
    if (!getDataUSer) {
      return res.status(400).json({
        success: false,
      });
    } else {
      return res.status(200).json({
        data: getDataUSer,
        success: true,
      });
    }
  },
  updateUser: async (req: any, res: any) => {
    try {
      const userId = req.params.id;

      const updateData = req.body as UserinfoType;

      const userAfterUpdat = await UserModel.findOneAndUpdate(
        { _id: userId },
        updateData,
        { new: true }
      ); // Return updated user
      if (userAfterUpdat == null) {
        return res.status(400).json({
          message: "This user Is'nt Exist",
          success: false,
        });
      } else {
        return res.status(200).json({
          message: "Update Is Done",
          success: true,
        });
      }
    } catch (error: any) {
      return res.status(200).json({
        message: error.message as string,
        success: false,
      });
    }
  },
  getContactInfoUser: async (req: any, res: any) => {
    const userId = req.params.id;
    const getDataUSer = await UserDetailsModel.findOne({ userId: userId });
    if (!getDataUSer) {
      return res.status(400).json({
        success: false,
      });
    } else {
      return res.status(200).json({
        data: getDataUSer,
        success: true,
      });
    }
  },
  updatecompanyInfoUser: async (req: any, res: any) => {
    try {
      const userId = req.params.id;
      const {
        nameComapny,
        phone,
        email,
        address,
        website,
        postCode,
        city,
        street,
      } = req.body as userCompanyInfo;
      console.log(userId);

      const getDataUSer = await UserCompanyModel.findOne({ userId: userId });

      if (getDataUSer == null) {
        const companyInfoUser = new UserCompanyModel({
          userId: userId,
          nameComapny,
          phone,
          email,
          address,
          website,
          postCode,
          city,
          street,
        });
        await companyInfoUser.save();
        return res.status(200).json({
          message: "Update Is Done",
          success: true,
        });
      } else {
        const userAfterUpdat = await UserCompanyModel.findOneAndUpdate(
          { userId: userId },
          {
            phone,
            nameComapny,
            email,
            address,
            website,
            postCode,
            city,
            street,
          },
          { new: true }
        ); // Return updated user
        if (userAfterUpdat == null) {
          return res.status(400).json({
            message: "This user Is'nt Exist",
            success: false,
          });
        } else {
          return res.status(200).json({
            message: "Update Is Done",
            success: true,
          });
        }
      }
    } catch (error: any) {
      res.status(402).json(error.message as string);
    }
  },
  getCompanyInfo: async (req: any, res: any) => {
    const userId = req.params.id;
    const getDataUSer = await UserCompanyModel.findOne({ userId: userId });
    if (!getDataUSer) {
      return res.status(400).json({
        success: false,
      });
    } else {
      return res.status(200).json({
        data: getDataUSer,
        success: true,
      });
    }
  },
  ImportUser: async (req: any, res: any) => {
    const data = req.body;
    const mappedData = data.map(async (item: any) => {
      const userInfo = {
        userName: item["First name"],
        password: "12345",
        name: item["Last name"],
        Brithday: item["Date of birth"],
      };
      const finaluser = new UserModel(userInfo);
      const userDataAfterSave = await finaluser.save();
      const contanctInfo = {
        userId: finaluser._id,
        phone: item["Phone"],
        email: item["Email"],
        address: item["Adress"],
        website: "web.com",
        postCode: item["Post/Zip Code"],
        city: item["City"],
        street: item["State / Region"],
      };
      const contactInfoUser = new UserDetailsModel(contanctInfo);
      await contactInfoUser.save();
    });
  },
  createUsers: async (req: any, res: any) => {
    try {
      console.log(req.body);

      const { userName, name, password, Brithday } = req.body as UserinfoType;

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
          name,
          Brithday,
        });
        console.log(finaluser, "finaluser");

        const userInfo = await finaluser.save();
        if (!userInfo) {
          return res.status(400).json({
            success: false,
            message: "uh, there is thing, try later",
          });
        }

        return res.status(200).json({
          data: userInfo,
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
  deleteUser: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      console.log(id);

      const userDelete = await UserModel.findByIdAndDelete(id);
      if (userDelete?._id) {
        const userContactDelete = await UserDetailsModel.findOneAndDelete({ userId:id});
          const userCompanyDelete = await UserCompanyModel.findOneAndDelete({ userId:id});
          
            res.status(200).json({
              message: "delete user is done",
              success: true,
            });
          
        
      }else{
        res.status(402).json({
          message: "delete user is falid",
          success: false,
        });

      }
    } catch (error: unknown) {
      res.status(402).json({
        message: error as string,
        success: false,
      });
    }
  },
};
