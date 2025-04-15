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
      const pageNumber = parseInt(req.params.pageNumber as string) || 1;
      const pageSize = parseInt(req.params.pageSize as string) || 10;
      const skipItems = (pageNumber - 1) * pageSize;

      const { fieldSort, sort, role, fields, fieldSearch, searchInput, dateRange } = req.body;
      console.log(fieldSort, sort, role, fields, fieldSearch, searchInput)
      if (fields == "All" && role == "All" && searchInput == "" && sort == "1" && dateRange.startDate == "" && dateRange.endDate == "") {
        console.log("test ")
        const users = await UserModel.find({}).skip(skipItems)
          .populate('companyID') // Populate the companyID field
          .populate('contactID') // Populate the contactID field
          .limit(pageSize)
        console.log(users)

        return res.status(200).json({
          success: true,
          data: users,
          message: 'Users retrieved successfully'
        });
      } else {
        const query: any = {};
        if (dateRange) {
          // Create a date filter if either startDate or endDate is provided
          if (dateRange.startDate || dateRange.endDate) {
            // Initialize createdAt object if it doesn't exist
            query.createdAt = query.createdAt || {};

            // If startDate is provided, use it; otherwise use a very old date
            if (dateRange.startDate) {
              query.createdAt.$gte = new Date(dateRange.startDate);
            } else {
              // You can set this to a reasonable "beginning of time" for your application
              query.createdAt.$gte = new Date('1970-01-01');
            }

            // If endDate is provided, use it; otherwise use current date
            if (dateRange.endDate) {
              query.createdAt.$lte = new Date(dateRange.endDate);
            } else {
              query.createdAt.$lte = new Date(); // Current date and time
            }
          }
        }
        // Add role filter if specified and not 'all'
        if (role && role !== 'All') {
          query.role = role;
        }

        // Add search filter if search input exists
        console.log(searchInput, fieldSearch)
        if (searchInput) {
          if (fieldSearch) {
            // If specific field is provided, search only in that field
            query[fieldSearch as string] = { $regex: searchInput, $options: 'i' };
          } else {
            // If no field is specified, default to searching by name only
            query.name = { $regex: searchInput, $options: 'i' };
          }
        }
        // Add empty/non-empty fields filter
        if (fields === 'empty') {
          query.$or = [
            { name: { $eq: '' } },
            { email: { $eq: '' } },

          ];
        } else if (fields !== 'empty') {
          query.$and = [
            { name: { $ne: '' } },
            { email: { $ne: '' } },
            { company: { $ne: '' } }
          ];
        }

        // Build sort options
        const sortOptions: Record<string, 1 | -1> = {};
        if (fieldSort) {
          sortOptions[fieldSort] = sort === '1' ? 1 : -1;
        }
        console.log(query)
        // Execute query with filters and sorting
        const users = await UserModel
          .find(query)
          .sort(sortOptions)
          .skip(skipItems)
          .limit(pageSize)
          .populate('companyID') // Populate the companyID field
          .populate('contactID') // Populate the contactID field
          .lean()
        // console.log(users)
        return res.status(200).json({
          success: true,
          data: users,
          message: 'Users retrieved successfully'
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
        const contactInfoUserData = await contactInfoUser.save();
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
        nameCompany,
        phone,
        email,
        address,
        website,
        postCode,
        city,
        street,
      } = req.body as userCompanyInfo;
      console.log(req.body,"nameComapny");


      const getDataUSer = await UserCompanyModel.findOne({ userId: userId });

      if (getDataUSer == null) {
        const companyInfoUser = new UserCompanyModel({
          userId: userId,
          nameCompany,
          phone,
          email,
          address,
          website,
          postCode,
          city,
          street,
        });


        const companyInfoUserData = await companyInfoUser.save();
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
            nameCompany,
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
    console.log(getDataUSer)
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
    console.log(data)
   try{
     
    const mappedData = data.map(async (item: any) => {


      const userInfo = {
        userName: item["Username"],
        password: "12345",
        name: item["name"],
        // Brithday: item["Brithday"],
        role: item["role"],
        createdAt: item["createdAt"],


      };
      const finale = new UserModel(userInfo);
      const userDataAfterSave = await finale.save();
      const contactInfo = {
        userId: userDataAfterSave._id,
        phone: item["Phone"],
        email: item["email"],
        address: `${item["city"]}/${item["street"]}/${item["postcode"]} `,
        website: "web.com",
        postCode: item["postcode"],
        city: item["city"],
        street: item["street"],
      };
      const contactInfoUser = new UserDetailsModel(contactInfo);
      await contactInfoUser.save();
    });
    return res.status(200).json({
      success: true,
      message: "Import is done",
    });
   }catch(error: any){
    res.status(402).json({
      message: error.message as string,
      success: false,
    });
   }
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

  },

};
