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

      // Generate JWT for auto login
      const token = jwt.sign(
        {
          id: newUser._id,
          role: newUser.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // Set cookie for auto login
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "User created successfully !",
        token,
        user: {
          id: newUser._id,
          fullname: newUser.fullname,
        }
      });
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
          phone: isExistUser.phone,
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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
        phone: user.phone,
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
    const ContactModel = require("../Model/contactModel");
    
    const userCount = await User.countDocuments({ role: "user" });
    const sellerCount = await User.countDocuments({ role: "seller" });
    const collectionCount = await CollectionModel.countDocuments();
    const categoryCount = await CategoryModel.countDocuments();
    const subCategoryCount = await SubCategoryModel.countDocuments();
    const contactCount = await ContactModel.countDocuments();

    return res.status(200).json({
      success: true,
      counts: {
        users: userCount,
        sellers: sellerCount,
        collections: collectionCount,
        categories: categoryCount,
        subcategories: subCategoryCount,
        contacts: contactCount
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
},

  updateProfile: async (req, res) => {
    try {
      const { fullname, phone } = req.body;

      if (!fullname || !phone) {
        return res.status(400).json({ success: false, message: "Fullname and phone number are required." });
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ success: false, message: "Please enter a valid 10-digit Indian phone number" });
      }

      const isExistPhone = await User.findOne({ phone, _id: { $ne: req.user._id } });
      if (isExistPhone) {
        return res.status(409).json({ success: false, message: "Phone number is already associated with another account." });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { fullname, phone },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: updatedUser._id,
          fullname: updatedUser.fullname,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  sendSellerOtp: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "No account found with this email address." });
      }

      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      user.loginOtp = otp;
      user.otpExpiry = expiry;
      await user.save();

      console.log(`\n========================================\n[SELLER OTP] OTP for ${email} is: ${otp}\n========================================\n`);

      // Attempt to send email if nodemailer is installed (optional fallback)
      try {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER || "test",
            pass: process.env.SMTP_PASS || "test"
          }
        });
        await transporter.sendMail({
          from: '"Veloza Seller Portal" <no-reply@veloza.com>',
          to: email,
          subject: "Seller Onboarding Verification OTP",
          text: `Your verification OTP is: ${otp}. It is valid for 10 minutes.`,
          html: `<p>Your verification OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
        });
      } catch (err) {
        // Nodemailer not installed or transport error; silent fallback to console log
      }

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email. (Please check console/terminal logs during local testing)",
        otp // return OTP in response for easy testing
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  verifySellerOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      if (user.loginOtp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP code." });
      }

      if (new Date() > user.otpExpiry) {
        return res.status(400).json({ success: false, message: "OTP code has expired." });
      }

      // Clear OTP
      user.loginOtp = null;
      user.otpExpiry = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Email verified successfully."
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  registerSeller: async (req, res) => {
    try {
      const { email, businessName, gstin, address } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required to complete seller registration."
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      // Update role and details
      user.role = "seller";
      user.businessName = businessName || user.businessName || "";
      user.gstin = gstin || user.gstin || "";
      user.address = address || user.address || "";
      await user.save();

      // Sign a new token with updated roles
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Congratulations! You have successfully registered as a seller.",
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          role: user.role,
          businessName: user.businessName,
          gstin: user.gstin,
          address: user.address
        },
        token
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = userController;
