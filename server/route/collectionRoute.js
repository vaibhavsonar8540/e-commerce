const express = require("express");
const collectionRoute = express.Router();
const collectionController = require("../Controller/collectionController");
const checkAuth = require("../Middleware/checkAuth");
const checkRole = require("../Middleware/authorization");

// Admin routes for creation (using checkAuth and checkRole check)
collectionRoute.post(
  "/create-collection",
  checkAuth,
  checkRole,
  collectionController.createCollection
);

collectionRoute.post(
  "/create-category",
  checkAuth,
  checkRole,
  collectionController.createCategory
);

collectionRoute.post(
  "/create-sub-category",
  checkAuth,
  checkRole,
  collectionController.createSubCategory
);

// Fetching routes (Public)
collectionRoute.get("/collections", collectionController.getCollections);
collectionRoute.get("/categories", collectionController.getCategories);
collectionRoute.get("/sub-categories", collectionController.getSubCategories);

module.exports = collectionRoute;
