const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // कुकीज़ से या Authorization हेडर से टोकन निकालें
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied: No Token Provided!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // इसमें यूजर की id और role सेव हो जाएगा
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or Expired Token!" });
  }
};

module.exports = verifyToken;