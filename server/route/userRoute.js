const express = require("express")
const userController = require("../Controller/userController")
const userRoute = express.Router()

userRoute.get("/test" , userController.test)
userRoute.post("/create" , userController.register)
userRoute.post("/login" , userController.login)

module.exports = userRoute