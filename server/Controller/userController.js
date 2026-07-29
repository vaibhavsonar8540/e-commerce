const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
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
          role: isExistUser.role,
          userBuyCount: isExistUser.userBuyCount || 0,
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
        role: user.role,
        userBuyCount: user.userBuyCount || 0,
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

      // Send email via Nodemailer helper
      try {
        await sendEmail({
          to: email,
          subject: `Velora Seller Portal - Verification Code: ${otp}`,
          text: `Your seller verification OTP is: ${otp}. Valid for 10 minutes.`,
          html: `<p>Your seller verification OTP is: <strong>${otp}</strong>. Valid for 10 minutes.</p>`,
        });
      } catch (err) {
        console.error("[SELLER OTP EMAIL ERROR]", err);
      }

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email.",
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
  },

  sendOrderOtp: async (req, res) => {
    try {
      const { email, phone } = req.body;
      if (!email && !phone) {
        return res.status(400).json({ success: false, message: "Email or phone number is required to send OTP." });
      }

      // Generate 6 digit OTP valid for 1 minute
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 1 * 60 * 1000);

      // Search user by req.user._id if authenticated, or by email / phone
      let user = null;
      if (req.user?._id) {
        user = await User.findById(req.user._id);
      }
      if (!user && email) {
        user = await User.findOne({ email });
      }
      if (!user && phone) {
        user = await User.findOne({ phone });
      }

      if (!user && email) {
        // Create user record if not existing so OTP can be stored and verified
        user = new User({
          email,
          fullname: email.split("@")[0],
          phone: phone || "",
        });
      }

      if (user) {
        user.loginOtp = otp;
        user.otpExpiry = expiry;
        await user.save();
      }

      // Send email via Nodemailer helper
      let emailResult = null;
      if (email) {
        emailResult = await sendEmail({
          to: email,
          subject: `Velora Store - Order Verification Code: ${otp}`,
          text: `Your verification OTP is: ${otp}. Valid for 1 minute.`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; color: #111; max-width: 550px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 24px; font-weight: 800; color: #000; margin: 0;">Velora Store</h2>
                <p style="color: #666; font-size: 13px; margin-top: 4px;">Checkout Verification</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <h3 style="font-size: 18px; color: #10b981; margin-top: 0;">Verify OTP for Checkout</h3>
              <p style="font-size: 14px; color: #444; line-height: 1.5;">
                You are one step away for buying product. Use the 6-digit OTP code below to verify your order:
              </p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; text-align: center; padding: 18px; border-radius: 12px; margin: 24px 0;">
                <span style="font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0f172a;">${otp}</span>
              </div>
              <p style="font-size: 12px; color: #ef4444; font-weight: 700; text-align: center;">This OTP is valid for 1 minute only. Please do not share this code with anyone.</p>
            </div>
          `,
        });
      }

      console.log(`[ORDER OTP] Email dispatched to ${email || phone}`);

      if (emailResult && !emailResult.success) {
        return res.status(500).json({
          success: false,
          message: `Failed to deliver email: ${emailResult.error}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${email}.`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  verifyOrderOtp: async (req, res) => {
    try {
      const { email, phone, otp } = req.body;
      if (!otp) {
        return res.status(400).json({ success: false, message: "OTP code is required." });
      }

      let user = null;
      if (req.user?._id) {
        user = await User.findById(req.user._id);
      }
      if (!user && email) {
        user = await User.findOne({ email });
      }
      if (!user && phone) {
        user = await User.findOne({ phone });
      }

      if (user && user.loginOtp) {
        if (user.loginOtp !== otp) {
          return res.status(400).json({ success: false, message: "Invalid OTP code." });
        }
        if (user.otpExpiry && new Date() > user.otpExpiry) {
          return res.status(400).json({ success: false, message: "OTP code has expired." });
        }
        user.loginOtp = null;
        user.otpExpiry = null;
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = userController;
