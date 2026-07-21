const express = require("express")
const checkAuth = require("../Middleware/checkAuth")
const cartController = require("../Controller/cartController")
const CartRouter = express.Router()

CartRouter.post("/add-to-cart" , checkAuth , cartController.addToCart);
CartRouter.post("/update-quantity" , checkAuth , cartController.updateQuantity);
CartRouter.post("/remove-from-cart" , checkAuth , cartController.removeFromCart);

CartRouter.get("/get-cart" , checkAuth , cartController.getCart)

module.exports = CartRouter