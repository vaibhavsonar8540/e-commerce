"use client";

import heroBanner from "@/assets/home/heroBanner.webp";
import heroBanner2 from "@/assets/home/hero.webp";
import HeroCarousel from "@/components/heroCarousel";
import KeyFeatures from "@/components/keyFeatures";
import OtherCollection from "@/components/otherCollection";
import MarqueeComponent from "@/components/marqueeComponent";
import Category from "./category";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstant";
import ProductSlider from "@/components/productSlider";
import fashionBanner from "@/assets/home/fashionBanner.webp";
import fashion2 from "@/assets/home/fashion2.webp";
import electronicBannerForBigScreen from "@/assets/home/electronicBannerForBigScreen.webp";
import electronicBannerForSmallScreen from "@/assets/home/electronicBannerSmallScreen.webp";
import CustomImage from "../customImage";
import Link from "next/link";
import { Button, LinkButton } from "../Buttons";

// Carousel images from assets/corosaul
import electronicLg from "@/assets/corosaul/electronic-lg.webp";
import electronicSmall from "@/assets/corosaul/electronic-small.webp";
import fashionLg from "@/assets/corosaul/fashion-lg.webp";
import fashionSmall from "@/assets/corosaul/fashion-small.webp";
import homeDecoreLg from "@/assets/corosaul/home-decore-lg.webp";
import homeDecoreSmall from "@/assets/corosaul/home-decore-small.webp";
import beautyLg from "@/assets/corosaul/beauty-lg.webp";
import beautySmall from "@/assets/corosaul/beauty-small.webp";

const heroSlides = [
  {
    src: fashionLg,
    mobileSrc: fashionSmall,
    altAttr: "Fashion Collection",
    href: "/collection/women",
  },
  {
    src: beautyLg,
    mobileSrc: beautySmall,
    altAttr: "Beauty Collection",
    href: "/collection/beauty",
  },
  {
    src: electronicLg,
    mobileSrc: electronicSmall,
    altAttr: "Electronics Collection",
    href: "/collection/electronics",
  },
  {
    src: homeDecoreLg,
    mobileSrc: homeDecoreSmall,
    altAttr: "Home & Decor Collection",
    href: "/collection/home-and-kitchen",
  },
];

const HomePage = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeSliders() {
      try {
        const [menRes, womenRes, electronicsRes] = await Promise.all([
          api.get("/product/get-filtered", {
            params: { collectionSlug: "men" },
          }),
          api.get("/product/get-filtered", {
            params: { collectionSlug: "women" },
          }),
          api.get("/product/get-filtered", {
            params: { collectionSlug: "electronics" },
          }),
        ]);
        if (menRes.data?.success) {
          setMenProducts(menRes.data.products.slice(0, 5));
        }
        if (womenRes.data?.success) {
          setWomenProducts(womenRes.data.products.slice(0, 5));
        }
        if (electronicsRes.data?.success) {
          setElectronicsProducts(electronicsRes.data.products.slice(0, 5));
        }
      } catch (err) {
        // catch silently
      } finally {
        setLoading(false);
      }
    }
    fetchHomeSliders();
  }, []);

  return (
    <div>
      <section className="bg-gray-100">
        <HeroCarousel slides={heroSlides} autoPlayInterval={4500} />
      </section>

      <MarqueeComponent />

      <section>
        <Category />
      </section>

      {womenProducts && (
        <section className="px-4 sm:px-8 md:px-12 lg:px-16 mt-6 lg:mt-10 animate-in fade-in duration-300">
          <ProductSlider
            title="Latest Arrivals For Women"
            products={womenProducts}
            collectionSlug="women"
          />
        </section>
      )}

      <section className="relative overflow-hidden mt-6 lg:mt-10">
        <CustomImage
          srcAttr={fashionBanner}
          altAttr="Fashion Banner"
          titleAttr="Fashion Banner"
          containerClassName="hidden lg:block"
        />

        <CustomImage
          srcAttr={fashion2}
          altAttr="Fashion Banner"
          titleAttr="Fashion Banner"
          containerClassName="block lg:hidden"
        />

        <div className="absolute right-3 xss:right-6 sm:right-12 md:right-20 top-1/2 -translate-y-1/2 select-none max-w-[85%]">
          <div className="flex flex-col space-y-1 sm:space-y-4 font-playfair text-white uppercase drop-shadow-md">
            <span className="text-xs xss:text-base sm:text-2xl md:text-4xl lg:text-5xl font-medium tracking-[0.15em] sm:tracking-[0.25em] ml-4 xss:ml-8 sm:ml-16 md:ml-24 leading-snug">
              Discover Your
            </span>
            <span className="text-sm xss:text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-[0.1em] sm:tracking-[0.15em] leading-tight">
              Signature Style
            </span>
          </div>
        </div>
      </section>

      {menProducts && (
        <section className="px-4 sm:px-8 md:px-12 lg:px-16 mt-6 lg:mt-10 animate-in fade-in duration-300">
          <ProductSlider
            title="Latest Arrivals For Men"
            products={menProducts}
            collectionSlug="men"
          />
        </section>
      )}

      <Link
        href="/collection/electronics"
        className="block relative overflow-hidden mt-6 lg:mt-10"
      >
        <CustomImage
          srcAttr={electronicBannerForBigScreen}
          altAttr="Electronic Banner"
          titleAttr="Electronic Banner"
          containerClassName="hidden lg:block"
        />

        <CustomImage
          srcAttr={electronicBannerForSmallScreen}
          altAttr="Electronic Banner"
          titleAttr="Electronic Banner"
          containerClassName="block lg:hidden"
        />

        <div className="absolute right-2 sm:right-12 md:right-20 top-1/2 -translate-y-1/2 select-none max-w-[50%] sm:max-w-md lg:max-w-lg">
          <div className="flex flex-col items-end text-right md:items-start md:text-left space-y-1 sm:space-y-4 text-black drop-shadow-md">
            <span className="text-[10px] xss:text-xs sm:text-2xl lg:text-3xl font-playfair uppercase font-medium tracking-[0.1em] sm:tracking-[0.25em] leading-tight sm:leading-snug">
              Upgrade Your Tech Today With Velora
            </span>
            <span className="text-[9px] xss:text-[10px] sm:text-sm tracking-[0.05em] sm:tracking-[0.15em] leading-tight hidden sm:block text-gray-800">
              Discover the latest electronics with premium quality, cutting-edge
              performance, and unbeatable value.
            </span>

            <div className="pt-0.5 sm:pt-1">
              <span className="inline-flex items-center justify-center bg-transparent border border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded-sm text-[10px] sm:text-sm py-1 px-2.5 sm:py-2 sm:px-4 font-medium">
                Explore Collection
              </span>
            </div>
          </div>
        </div>
      </Link>

      {electronicsProducts && electronicsProducts.length > 0 && (
        <section className="px-4 sm:px-8 md:px-12 lg:px-16 my-6 lg:my-10 animate-in fade-in duration-300">
          <ProductSlider
            title="Latest Arrivals In Electronics"
            products={electronicsProducts}
            collectionSlug="electronics"
          />
        </section>
      )}

      <OtherCollection />

      <KeyFeatures />
    </div>
  );
};

export default HomePage;
