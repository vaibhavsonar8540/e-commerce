const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const userController = {
  test: (req, res) => {
    res.send("Test route is working");
  },

  register: async (req, res) => {
    const { fullname, email, phone, password } = req.body;

    if (!fullname || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
      const isExistUser = await User.findOne({ email });
      if (isExistUser) {
        return res
          .status(409)
          .json({
            message: "User already existed ! , please go to Login screen",
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      if (!hashedPassword) {
        return res.status(404).json({ message: "Error while hasing password" });
      }

      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User created successfully !", newUser });
    } catch (error) {
      res.status(404).json({ message: "Error while creating new user", error });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    try {
      // 1. डेटाबेस में ईमेल के द्वारा यूजर को खोजें
      const isExistUser = await User.findOne({ email }).select("+password");

      // अगर यूजर नहीं मिलता
      if (!isExistUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // 2. PASSWORD CHECK: पासवर्ड मैच करें
      const matchedPassword = await bcrypt.compare(
        password,
        isExistUser.password
      );

      if (!matchedPassword) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      // 3. GENERATE TOKEN: पेलोड में रोल भी डाल दें ताकि फ्रंटएंड/मिडिलवेयर पर काम आए
      const token = jwt.sign(
        {
          id: isExistUser._id,
          role: isExistUser.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // 4. COOKIE SETTING
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // केवल HTTPS पर काम करेगा प्रोडक्शन में
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // रिस्पॉन्स में यूजर प्रोफाइल (बिना पासवर्ड के) भेजें ताकि रिडक्स स्टोर अपडेट हो सके
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: isExistUser._id,
          fullname: isExistUser.fullname,
          email: isExistUser.email,
          role: isExistUser.role
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

   logout : async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
},

// Add this inside your userController object
getMe: async (req, res) => {
  try {
    // req.user has been attached by your CheckAuth middleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
},

getUsers: async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query).select("-password");
    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
},

getDashboardStats: async (req, res) => {
  try {
    const CollectionModel = require("../Model/collection/collectionModel");
    const CategoryModel = require("../Model/collection/categoryModel");
    const SubCategoryModel = require("../Model/collection/subCategoryModel");
    
    const userCount = await User.countDocuments({ role: "user" });
    const sellerCount = await User.countDocuments({ role: "seller" });
    const collectionCount = await CollectionModel.countDocuments();
    const categoryCount = await CategoryModel.countDocuments();
    const subCategoryCount = await SubCategoryModel.countDocuments();

    return res.status(200).json({
      success: true,
      counts: {
        users: userCount,
        sellers: sellerCount,
        collections: collectionCount,
        categories: categoryCount,
        subcategories: subCategoryCount
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
},
};

module.exports = userController;
