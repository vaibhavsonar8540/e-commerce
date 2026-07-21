const express = require("express");
const checkAuth = require("../Middleware/checkAuth");
const filerController = require("../Controller/filer");

const FilerRouter = express.Router();

// Route for searching users (requires auth)
FilerRouter.get("/user", checkAuth, filerController.searchUserByEmail);

// Route for searching products (public)
FilerRouter.get("/product", filerController.searchProduct);

// Route for latest arrivals by collection (public)
FilerRouter.get("/latest-arrivals-by-collections", filerController.getLatestArrivalsByCollections);

module.exports = FilerRouter;
