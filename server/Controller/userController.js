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

      // 2. STRICT ROLE CHECK: चेक करें कि यूजर का रोल 'admin' है या नहीं
      // (यह मानकर कि आपके Schema में role: { type: String, default: 'user' } है)
      if (isExistUser.role !== "admin") {
        return res.status(403).json({
          message: "Access Denied: You do not have permission to access the admin portal.",
        });
      }

      // 3. PASSWORD CHECK: पासवर्ड मैच करें
      const matchedPassword = await bcrypt.compare(
        password,
        isExistUser.password
      );

      if (!matchedPassword) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      // 4. GENERATE TOKEN: पेलोड में रोल भी डाल दें ताकि फ्रंटएंड/मिडिलवेयर पर काम आए
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

      // 5. COOKIE SETTING
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // केवल HTTPS पर काम करेगा प्रोडक्शन में
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // रिस्पॉन्स में यूजर प्रोफाइल (बिना पासवर्ड के) भेजें ताकि रिडक्स स्टोर अपडेट हो सके
      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          id: isExistUser._id,
          fullname: isExistUser.fullname,
          email: isExistUser.email
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
}
};

module.exports = userController;
