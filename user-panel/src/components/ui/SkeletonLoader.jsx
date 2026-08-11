"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Single Product Card Skeleton loader matching ProductCard design
 */
export function ProductCardSkeleton() {
  return (
    <div className="group w-full relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 flex flex-col justify-between shadow-xs">
      {/* Top Wishlist Circle Placeholder */}
      <div className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-gray-200/80 animate-pulse" />

      {/* Image Block Placeholder */}
      <div className="w-full aspect-4/3 bg-gray-200/70 animate-pulse p-4 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gray-300/40 animate-pulse" />
      </div>

      {/* Content Block Placeholder */}
      <div className="flex flex-1 flex-col p-4 justify-between space-y-3 border-t border-gray-50">
        <div className="space-y-2">
          {/* Title line */}
          <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse" />
          {/* Price line */}
          <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse" />
        </div>

        {/* Button Placeholder */}
        <div className="mt-2">
          <div className="h-9 bg-gray-200 rounded-xl w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Product Slider Skeleton: Horizontal row of product card skeletons
 */
export function ProductSliderSkeleton({ count = 5 }) {
  return (
    <div className="flex gap-4 overflow-x-hidden pb-4 select-none">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="w-[calc(50%-8px)] xs:w-[calc(33.33%-11px)] sm:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] shrink-0"
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

/**
 * Collection Navigation Skeleton for Header / Mega Menu
 */
export function CollectionNavSkeleton() {
  const itemWidths = ["w-16", "w-12", "w-14", "w-32", "w-16", "w-24", "w-20"];
  return (
    <div className="flex gap-6 sm:gap-10 items-center">
      {itemWidths.map((w, idx) => (
        <div
          key={idx}
          className={`h-4 ${w} bg-gray-200/90 rounded-md animate-pulse shrink-0`}
        />
      ))}
    </div>
  );
}

/**
 * Reusable Error State Component with Retry Action
 */
export function ErrorState({ message = "Failed to load data.", onRetry }) {
  return (
    <div className="w-full bg-red-50/80 border border-red-200/80 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-3 my-4">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
        <AlertCircle size={24} />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="text-sm font-bold text-red-900">Oops! Something went wrong</h4>
        <p className="text-xs text-red-600 font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export default ProductCardSkeleton;
