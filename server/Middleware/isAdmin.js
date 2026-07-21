const User = require("../Model/userModel");

const IsAdmin = async (req, res, next) => {
    try {
        // req.user comes from your checkAuth middleware (which sets req.user = decoded)
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        //  Find user by ID in the database and select ONLY the role field
        const user = await User.findById(req.user.id).select("role");

        //  Check if user exists and if their role is admin
        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource.",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message 
        });
    }
};

module.exports = IsAdmin;