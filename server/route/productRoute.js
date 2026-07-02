const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");
const productController = require("../Controller/productController");
import checkAuth from "../Middleware/checkAuth"
import checkRole from "../Middleware/authorization"

router.post(
  "/create",
  checkAuth,
  checkRole("admin", "seller"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 1 },
  ]),
  productController.create,
);

router.get("/get", productController.get)
router.get("/my-products" , productController.myProducts)

module.exports = router;
