const Coupon = require("../Model/couponModel");

const couponController = {
  // 1. CREATE A NEW COUPON CODE
  createCoupon: async (req, res) => {
    try {
      const { code, discount, discountType, minOrderAmount } = req.body;

      if (!code || discount === undefined || discount === null) {
        return res.status(400).json({
          success: false,
          message: "Coupon code and discount value are required.",
        });
      }

      const formattedCode = code.toString().trim().toUpperCase();
      const discountNum = Number(discount);
      if (isNaN(discountNum) || discountNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid discount amount greater than 0.",
        });
      }

      const existingCoupon = await Coupon.findOne({ code: formattedCode });
      if (existingCoupon) {
        return res.status(409).json({
          success: false,
          message: `Coupon code '${formattedCode}' already exists. Please choose a different code.`,
        });
      }

      const coupon = await Coupon.create({
        code: formattedCode,
        discount: discountNum,
        discountType: discountType || "percentage",
        minOrderAmount: Number(minOrderAmount) || 0,
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        message: "Coupon code created successfully.",
        data: coupon,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "A coupon code with this exact name already exists.",
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error while creating coupon.",
      });
    }
  },

  // 2. FETCH ALL CREATED COUPONS
  getAllCoupons: async (req, res) => {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },

  // 3. DELETE A COUPON
  deleteCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findByIdAndDelete(id);
      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Coupon code not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Coupon code deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },

  // 4. VERIFY AND APPLY COUPON CODE
  verifyCoupon: async (req, res) => {
    try {
      const { code, subtotal } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Please enter a coupon code.",
        });
      }

      const formattedCode = code.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: formattedCode, isActive: true });

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired coupon code.",
        });
      }

      const currentSubtotal = Number(subtotal) || 0;

      if (coupon.minOrderAmount > 0 && currentSubtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount to apply this coupon is ₹${coupon.minOrderAmount}.`,
        });
      }

      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = (currentSubtotal * coupon.discount) / 100;
      } else {
        discountAmount = Math.min(coupon.discount, currentSubtotal);
      }

      // Enforce minimum 1 INR payable total if subtotal >= 1 (Razorpay minimum threshold)
      if (currentSubtotal >= 1 && currentSubtotal - discountAmount < 1) {
        discountAmount = Math.max(0, currentSubtotal - 1);
      }

      discountAmount = Number(discountAmount.toFixed(2));
      const finalAmount = Number(Math.max(0, currentSubtotal - discountAmount).toFixed(2));

      return res.status(200).json({
        success: true,
        message: `Coupon code '${coupon.code}' applied successfully!`,
        data: {
          code: coupon.code,
          discountValue: coupon.discount,
          discountType: coupon.discountType,
          discountAmount: discountAmount,
          finalAmount: finalAmount,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
};

module.exports = couponController;
