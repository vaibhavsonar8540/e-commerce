"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./productCard";

export default function ProductSlider({ title, subtitle, products = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Slider Header */}
      <div className="flex items-end justify-between border-b border-[#47230B]/10 pb-3 px-1">
        <div>
          <h2 className="text-2xl font-extrabold text-[#47230B] font-playfair tracking-tight capitalize">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 border border-[#47230B]/15 hover:border-[#47230B]/30 hover:bg-[#F9ECE5]/40 text-[#47230B] rounded-full transition shadow-sm cursor-pointer flex items-center justify-center"
            aria-label="Previous products"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 border border-[#47230B]/15 hover:border-[#47230B]/30 hover:bg-[#F9ECE5]/40 text-[#47230B] rounded-full transition shadow-sm cursor-pointer flex items-center justify-center"
            aria-label="Next products"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Slider Content */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
      >
        {products.map((product) => (
          <div
            key={product._id || product.id}
            className="w-[calc(50%-8px)] xs:w-[calc(33.33%-11px)] sm:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] shrink-0 snap-start"
          >
            <ProductCard data={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
