const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

async function OptionalAuth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Ignore invalid/expired token for optional authentication routes
  }

  next();
}

module.exports = OptionalAuth;
