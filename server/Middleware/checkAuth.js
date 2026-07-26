const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

async function CheckAuth(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user; // Save user for next middleware

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = CheckAuth;