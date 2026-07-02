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
      const isExistUser = await User.findOne({ email }).select("+password");

      if (!isExistUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const matchedPassword = await bcrypt.compare(
        password,
        isExistUser.password,
      );

      if (!matchedPassword) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          id: isExistUser._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = userController;
