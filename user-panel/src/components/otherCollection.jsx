"use client";

import { useState } from "react";
import Link from "next/link";
import watch from "@/assets/home/watch.webp";
import watch1 from "@/assets/home/watch1.webp";
import watch2 from "@/assets/home/watch2.webp";
import decor from "@/assets/home/decor.webp";
import decor1 from "@/assets/home/decor1.webp";
import decor2 from "@/assets/home/decor2.webp";
import beauty from "@/assets/home/beauty.webp";
import beauty2 from "@/assets/home/beauty-2.webp";
import CustomImage from "./customImage";
import { LinkButton } from "./Buttons";

const collections = [
  {
    id: 1,
    title: "Watch Collection",
    subtitle: "Timeless Elegance",
    image: watch,
    href: "/collection/watches",
  },
  {
    id: 2,
    title: "Home & Kitchen",
    subtitle: "Modern Living Essentials",
    image: decor,
    href: "/collection/home-and-kitchen",
  },
  {
    id: 3,
    title: "Beauty & Personal Care",
    subtitle: "Glow & Glamour",
    image: beauty,
    href: "/collection/beauty",
  },
];

const OtherCollection = () => {
  // First slide (index 0) active by default
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full mt-6 lg:mt-10 px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="flex flex-col md:flex-row w-full min-h-[520px] sm:min-h-[600px] md:h-[600px] lg:h-[700px] gap-3 sm:gap-4 overflow-hidden">
        {collections.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ease-in-out group ${
                isActive
                  ? "flex-[2.5] min-h-[260px] md:min-h-0 h-full"
                  : "flex-1 min-h-[90px] md:min-h-0 md:h-full opacity-80 hover:opacity-100"
              }`}
            >
              <CustomImage
                srcAttr={item.image}
                altAttr={item.title}
                titleAttr={item.title}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive
                    ? "bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    : "bg-black/40 hover:bg-black/25"
                }`}
              />

              {/* Content Box */}
              <div
                className={`absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end transition-all duration-500 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-90 md:opacity-70"
                }`}
              >
                <span className="text-xs uppercase tracking-widest text-gray-300 font-medium mb-1">
                  {item.subtitle}
                </span>
                <h3
                  className={`font-playfair font-bold text-white transition-all duration-300 ${
                    isActive
                      ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4"
                      : "text-base sm:text-lg md:text-xl line-clamp-1"
                  }`}
                >
                  {item.title}
                </h3>

                {isActive && (
                  <div className="animate-in fade-in duration-300">
                    <LinkButton
                      href={item.href}
                      className="!bg-white !text-black hover:!bg-gray-100 !border-none font-semibold text-xs sm:text-sm !py-2.5 !px-5 inline-flex items-center gap-2 shadow-md whitespace-nowrap"
                    >
                      Explore Collection
                    </LinkButton>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OtherCollection;
