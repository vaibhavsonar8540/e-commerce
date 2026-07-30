"use client";

import React, { useEffect, useState } from "react";
import logo from "@/../public/images/logo.png";
import CustomImage from "./customImage";
import { useSelector } from "react-redux";
import api from "@/utils/axiosInstant";

const defaultEcommerceItems = [
  "FREE SHIPPING ON ORDERS OVER ₹999",
  "NEW SEASON ARRIVALS NOW LIVE",
  "100% PREMIUM QUALITY & TRENDY FASHION",
  "7 DAYS EASY RETURNS & EXPRESS DELIVERY",
  "DISCOVER EXCLUSIVE COLLECTIONS TODAY",
];

const MarqueeItemSequence = ({ items }) => (
  <div className="flex items-center gap-5 sm:gap-8 md:gap-12 shrink-0">
    {items.map((text, idx) => (
      <React.Fragment key={idx}>
        {/* Logo separator */}
        <div className="flex items-center justify-center shrink-0">
          <CustomImage
            srcAttr={logo}
            altAttr="Velora Logo"
            titleAttr="Velora"
            className="h-6 sm:h-8 md:h-10 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Marquee Text */}
        <span className="whitespace-nowrap text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider sm:tracking-widest text-white uppercase">
          {text}
        </span>
      </React.Fragment>
    ))}
  </div>
);

const MarqueeComponent = () => {
  const { user } = useSelector((state) => state.auth);
  const [coupons, setCoupons] = useState([]);

  // Check if user has userBuyCount > 0
  const hasUserBuyCount = Boolean(user && user.userBuyCount > 0);

  useEffect(() => {
    // Only fetch coupons if user has userBuyCount > 0
    if (hasUserBuyCount) {
      api
        .get("/coupon/all")
        .then((res) => {
          if (res.data?.success && res.data?.data?.length > 0) {
            setCoupons(res.data.data);
          }
        })
        .catch((err) => {
          // catch silently
        });
    }
  }, [hasUserBuyCount]);

  // Determine marquee items list based on userBuyCount
  let marqueeItems = defaultEcommerceItems;

  if (hasUserBuyCount) {
    if (coupons.length > 0) {
      const topCoupon = coupons[0];
      const discountLabel =
        topCoupon.discountType === "percentage"
          ? `${topCoupon.discount}% OFF`
          : `₹${topCoupon.discount} OFF`;

      marqueeItems = [
        `USE COUPON CODE: ${topCoupon.code} TO GET ${discountLabel}!`,
        "EXCLUSIVE PROMO CODE AVAILABLE FOR YOUR NEXT PURCHASE",
        "APPLY COUPON CODE AT CHECKOUT TO SAVE MORE",
        "FREE SHIPPING ON ORDERS OVER ₹999",
      ];
    } else {
      marqueeItems = [
        "USE PROMO COUPONS AT CHECKOUT FOR EXCLUSIVE DISCOUNTS",
        "EXCLUSIVE SPECIAL OFFERS UNLOCKED FOR YOU",
        "APPLY COUPON CODE AT CHECKOUT TO SAVE MORE",
        "FREE SHIPPING ON ORDERS OVER ₹999",
      ];
    }
  }

  return (
    <div className="w-full h-12 sm:h-14 md:h-[60px] bg-black border-y border-white/10 overflow-hidden flex items-center select-none relative z-10">
      <div className="animate-marquee flex items-center gap-5 sm:gap-8 md:gap-12 will-change-transform">
        <MarqueeItemSequence items={marqueeItems} />
        <MarqueeItemSequence items={marqueeItems} />
        <MarqueeItemSequence items={marqueeItems} />
        <MarqueeItemSequence items={marqueeItems} />
      </div>
    </div>
  );
};

export default MarqueeComponent;