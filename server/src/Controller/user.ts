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
      const { fieldSort, sort, role, fields, fieldSearch, searchInput } = req.body;
      console.log(fields, fieldSearch)
      const sortAsNumber = sort == "1" ? 1 : -1
      const regex = searchInput == "" ? new RegExp(/^[a-zA-Z0-9]+$/) : new RegExp(`^${searchInput}`, 'i')
      console.log(regex, "regex")
      const search = {
        $match: {
          [fieldSearch]: { $regex: regex }
        }
      }
      const RoleSort = {
        $match: {
          role: role
        }
      }
      const SortAlphaB = {
        $sort: {
          [fieldSort]: sortAsNumber

        }
      }
      const EmptyFields = {
        $match: {
          $or: [
            { "contact.email": "" },
            { "contact.phone": "" },
            { "company.name": "" },
            { "name": "" },

          ]
        }
      }
      const pipeline: any = [
        {
          $lookup: {
            from: "contactInfo",
            localField: "contactId",
            foreignField: "_id",
            as: "contact"
          }
        },
     
        {
          $unwind: {
            path: "$contact",
            preserveNullAndEmptyArrays: true
          }
        },
       {
        $match: {
          name  : { $regex: regex }
        }}


      ]

      if (role !== "All" && fields !== "Empty") {
        console.log("i am working")
        const recallPost = await UserModel.aggregate([...pipeline, RoleSort, SortAlphaB])
        console.log("i am working",recallPost)
        console.log(recallPost)
        return res.status(200).json({
          data: recallPost,
          success: true,
        });
      } else if (fields == "Empty" && role !== "All") {
        console.log("i am working2")
        const recallPost = await UserModel.aggregate([...pipeline, search, EmptyFields,
          RoleSort, SortAlphaB

        ])
        return res.status(200).json({
          data: recallPost,
          success: true,
        });

      } else if (fields !== "Empty" && role == "All") {
        console.log("i am working3")

        const recallPost = await UserModel.aggregate([...pipeline, SortAlphaB

        ])
        console.log("i am working3",recallPost)
        return res.status(200).json({
          data: recallPost,
          success: true,
        });

      } else if (fields == "Empty" && role == "All") {
        console.log("i am working4")
        console.log(role !== "All" && fields !== "Empty")

        const recallPost = await UserModel.aggregate([...pipeline, search, EmptyFields, SortAlphaB

        ])
        return res.status(200).json({
          data: recallPost,
          success: true,
        });

      }


    } catch (error: unknown) {
      return res.status(500).json({
        message: error,
        success: false,
      });
    }
  },
  getNumberUsers: async (req: any, res: any) => {
    console.log("scss");
    UserModel.countDocuments()
      .then((count) => {
        console.log(count);
        res.status(200).json({
          data: count,
          success: true,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message: err,
          success: false,
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
        const contactInfoUserData=await contactInfoUser.save();
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { contactID: contactInfoUserData?._id },
          { new: true, runValidators: true }
        );
        return res.status(200).json({
          message: "Update Is Done",
          success: true,
        });
      } else {
        const userAfterUpdate = await UserDetailsModel.findOneAndUpdate(
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
        if (userAfterUpdate == null) {
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

      const userAfterUpdate = await UserModel.findOneAndUpdate(
        { _id: userId },
        updateData,
        { new: true }
      ); // Return updated user
      if (userAfterUpdate == null) {
        return res.status(400).json({
          message: "This user Is'nt Exist",
          success: false,
        });
      } else {
        return res.status(200).json({
          data: userAfterUpdate,
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
       

       const companyInfoUserData= await companyInfoUser.save();
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { companyID: companyInfoUserData._id },
          { new: true, runValidators: true }
        );
        return res.status(200).json({
          message: "Update Is Done",
          success: true,
        });
      } else {
        const userAfterUpdate = await UserCompanyModel.findOneAndUpdate(
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
        if (userAfterUpdate == null) {
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
      const finale = new UserModel(userInfo);
      const userDataAfterSave = await finale.save();
      const contactInfo = {
        userId: finale._id,
        phone: item["Phone"],
        email: item["Email"],
        address: item["Adress"],
        website: "web.com",
        postCode: item["Post/Zip Code"],
        city: item["City"],
        street: item["State / Region"],
      };
      const contactInfoUser = new UserDetailsModel(contactInfo);
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
        const finale = new UserModel({
          userName: newusername,
          password,
          name,
          Brithday,
        });
        console.log(finale, "finale");

        const userInfo = await finale.save();
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
        const userContactDelete = await UserDetailsModel.findOneAndDelete({ userId: id });
        const userCompanyDelete = await UserCompanyModel.findOneAndDelete({ userId: id });

        res.status(200).json({
          message: "delete user is done",
          success: true,
        });


      } else {
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
  userFilter: async (req: any, res: any) => {
    const filterItem = await UserDetailsModel.aggregate([
      {
        $group: {
          _id: null,
          city: { $addToSet: "$city" },

        }
      },
      {
        $project: {
          _id: 0,
          city: 1,

        }
      }
    ])
    res.status(200).json({
      data: filterItem,
      success: true,
    });

  }
};
