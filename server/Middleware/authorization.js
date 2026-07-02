function CheckRole(req, res, next) {

    if (req.user.role === "admin" || req.user.role === "seller") {
        return next();
    }

    return res.status(403).json({
        message: "Access Denied"
    });
}

module.exports = CheckRole;