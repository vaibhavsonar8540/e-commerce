const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");
const productController = require("../Controller/productController");
const checkAuth = require("../Middleware/checkAuth");
const checkRole = require("../Middleware/authorization");

router.post(
  "/create",
  checkAuth,
  checkRole,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 1 },
  ]),
  productController.create,
);

router.get("/get", productController.get)
router.get("/my-products" , productController.myProducts)
router.get("/most-sold", productController.getMostSold);
router.get("/new-arrivals", productController.getNewArrivals); // latest 5 products

module.exports = router;
