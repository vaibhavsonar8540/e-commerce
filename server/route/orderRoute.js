const express = require("express");
const orderRouter = express.Router();
const orderController = require("../Controller/orderController"); // Adjust path based on your folder structure
const checkAuth = require("../Middleware/checkAuth");

// 1. PLACE A NEW ORDER
// POST /api/orders/place
orderRouter.post("/place", checkAuth, orderController.placeOrder);

// 2. GET LOGGED-IN USER'S ORDER HISTORY
// GET /api/orders/history
orderRouter.get("/history", checkAuth, orderController.getOrderHistory);

module.exports = orderRouter;