const express = require("express")
const userController = require("../Controller/userController")
const CheckAuth = require("../Middleware/checkAuth")
const OptionalAuth = require("../Middleware/optionalAuth")
const CheckRole = require("../Middleware/authorization")
const userRoute = express.Router()

userRoute.get("/test" , userController.test)
userRoute.post("/create" , userController.register)
userRoute.post("/register" , userController.register)
userRoute.post("/login" , userController.login)
userRoute.get("/me", CheckAuth, userController.getMe)
userRoute.put("/update-profile", CheckAuth, userController.updateProfile)
userRoute.put("/update-store", CheckAuth, userController.updateStoreInfo)
userRoute.get("/all", CheckAuth, CheckRole, userController.getUsers)
userRoute.get("/dashboard-stats", CheckAuth, CheckRole, userController.getDashboardStats)

// Seller onboarding
userRoute.post("/register-seller", userController.registerSeller)

module.exports = userRoute