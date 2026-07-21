const express = require("express");
const wishlistController = require("../Controller/wishlistController");
const checkAuth = require("../Middleware/checkAuth");
const wishlistRouter = express.Router();


wishlistRouter.post("/add-to-favrouite", checkAuth, wishlistController.addToFav);

wishlistRouter.get("/wishlist", checkAuth, wishlistController.getWishlist);

module.exports = wishlistRouter;