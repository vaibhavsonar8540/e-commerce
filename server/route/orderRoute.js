const express = require("express");
const orderRouter = express.Router();
const orderController = require("../Controller/orderController"); // Adjust path based on your folder structure
const checkAuth = require("../Middleware/checkAuth");

// Create Razorpay Order
orderRouter.post("/create-razorpay-order", checkAuth, orderController.createRazorpayOrder);

// 1. PLACE A NEW ORDER
orderRouter.post("/place", checkAuth, orderController.placeOrder);
orderRouter.post("/place-order", checkAuth, orderController.placeOrder);

// 2. GET LOGGED-IN USER'S ORDER HISTORY
orderRouter.get("/history", checkAuth, orderController.getOrderHistory);

module.exports = orderRouter;