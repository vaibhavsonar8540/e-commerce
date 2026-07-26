"use client";

import React from "react";
import logo from "@/../public/images/logo.png";
import CustomImage from "./customImage";

const marqueeItems = [
  "GET 10% OFF ON YOUR FIRST PURCHASE",
  "FREE SHIPPING ON ORDERS OVER ₹999",
  "NEW SEASON ARRIVALS NOW LIVE",
  "USE CODE: VELORA10 AT CHECKOUT",
];

const MarqueeItemSequence = () => (
  <div className="flex items-center gap-5 sm:gap-8 md:gap-12 shrink-0">
    {marqueeItems.map((text, idx) => (
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
  return (
    <div className="w-full h-12 sm:h-14 md:h-[60px] bg-black border-y border-white/10 overflow-hidden flex items-center select-none relative z-10">
      <div className="animate-marquee flex items-center gap-5 sm:gap-8 md:gap-12 will-change-transform">
        <MarqueeItemSequence />
        <MarqueeItemSequence />
        <MarqueeItemSequence />
        <MarqueeItemSequence />
      </div>
    </div>
  );
};

export default MarqueeComponent;