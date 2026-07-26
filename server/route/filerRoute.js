const express = require("express");
const checkAuth = require("../Middleware/checkAuth");
const filterController = require("../Controller/filter");

const FilterRouter = express.Router();

// Route for searching users (requires auth)
FilterRouter.get("/user", checkAuth, filterController.searchUserByEmail);

// Route for searching products (public)
FilterRouter.get("/product", filterController.searchProduct);

// Route for latest arrivals by collection (public)
FilterRouter.get(
  "/latest-arrivals-by-collections",
  filterController.getLatestArrivalsByCollections,
);

module.exports = FilterRouter;
