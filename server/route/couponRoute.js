const express = require("express");
const couponController = require("../Controller/couponController");

const couponRouter = express.Router();

couponRouter.post("/create", couponController.createCoupon);
couponRouter.get("/all", couponController.getAllCoupons);
couponRouter.delete("/:id", couponController.deleteCoupon);
couponRouter.post("/apply", couponController.verifyCoupon);
couponRouter.patch("/toggle-status/:id", couponController.toggleCouponStatus);
couponRouter.put("/toggle-status/:id", couponController.toggleCouponStatus);

module.exports = couponRouter;
