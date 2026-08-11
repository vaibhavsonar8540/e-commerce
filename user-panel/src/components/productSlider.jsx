"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./productCard";
import { ProductSliderSkeleton } from "@/components/ui/SkeletonLoader";

export default function ProductSlider({
  title,
  subtitle,
  products = [],
  collectionSlug,
  seeMoreUrl,
  loading = false,
  error = null,
}) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Derive redirection URL
  let targetUrl = seeMoreUrl;
  if (!targetUrl) {
    if (collectionSlug) {
      targetUrl = `/collection/${collectionSlug}`;
    } else if (title?.toLowerCase().includes("women")) {
      targetUrl = "/collection/women";
    } else if (title?.toLowerCase().includes("men")) {
      targetUrl = "/collection/men";
    } else {
      targetUrl = "/collection";
    }
  }

  const hasProducts = Array.isArray(products) && products.length > 0;
  const showSkeleton = loading || error || !hasProducts;

  // Auto slide functionality (Timer: slow 3.5s interval)
  const autoSlide = useCallback(() => {
    if (!scrollRef.current || isHovered || isDragging) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    // Check if reached end (with 10px buffer)
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const cardWidth = clientWidth > 640 ? 240 : 180;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  }, [isHovered, isDragging]);

  useEffect(() => {
    if (!hasProducts || showSkeleton) return;
    const interval = setInterval(autoSlide, 3500);
    return () => clearInterval(interval);
  }, [autoSlide, hasProducts, showSkeleton]);

  // Mouse Drag / Touch User Interaction handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div className="space-y-4">
      {/* Slider Header */}
      <div className="flex items-end justify-between border-b border-[#47230B]/10 pb-3 px-1">
        <div>
          <h2 className="text-base sm:text-lg md:text-2xl font-extrabold text-[#47230B] font-playfair tracking-tight capitalize">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">{subtitle}</p>
          )}
        </div>

        {/* See More Link */}
        <Link
          href={targetUrl}
          className="text-xs sm:text-sm font-bold text-[#47230B] hover:text-black hover:underline transition flex items-center gap-1 sm:gap-1.5 cursor-pointer pb-0.5 sm:pb-1 group shrink-0"
        >
          <span>See More</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Main Content: Show product card skeletons if server is offline/loading/empty */}
      {showSkeleton ? (
        <ProductSliderSkeleton count={5} />
      ) : (
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-none select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="w-[calc(50%-8px)] xs:w-[calc(33.33%-11px)] sm:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] shrink-0"
            >
              <ProductCard data={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
