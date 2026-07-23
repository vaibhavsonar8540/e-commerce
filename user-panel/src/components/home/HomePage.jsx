"use client";

import heroBanner from "@/assets/home/heroBanner.webp";
import HeroBanner from "@/components/heroBanner";
import { GiBoxUnpacking } from "react-icons/gi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { ImPriceTags } from "react-icons/im";
import Category from "./category";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstant";
import ProductSlider from "@/components/productSlider";
import fashionBanner from "@/assets/home/fashionBanner.webp";
import electronicBannerForBigScreen from "@/assets/home/electronicBannerBigScreen.webp";
import electronicBannerForSmallScreen from "@/assets/home/electronicBannerSmallScreen.webp";
import CustomImage from "../customImage";

const HomePage = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeSliders() {
      try {
        const [menRes, womenRes] = await Promise.all([
          api.get("/product/get-filtered", {
            params: { collectionSlug: "men" },
          }),
          api.get("/product/get-filtered", {
            params: { collectionSlug: "women" },
          }),
        ]);
        if (menRes.data?.success) {
          setMenProducts(menRes.data.products.slice(0, 5));
        }
        if (womenRes.data?.success) {
          setWomenProducts(womenRes.data.products.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching home sliders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeSliders();
  }, []);

  return (
    <div>
      <section>
        <HeroBanner
          src={heroBanner}
          title="Elevate Your Style"
          desc="Premium fashion and lifestyle essentials for every day."
          btnText="Explore Collections"
          btnClassName="font-medium !rounded-none"
          variant="whiteHover"
          contentClass="absolute w-[20%] top-1/2 -translate-y-1/2 !right-10"
          titleClass="text-white !font-playfair font-semibold"
          descClass="text-white pt-3 pb-5 font-medium"
          href=""
          altAttr="home"
          titleAttr="home"
        />
      </section>

      <div className="bg-[#F3F4F6] py-3 px-5">
        <div className="py-2 bg-white flex justify-center items-center gap-4 rounded-md">
          <div className="flex gap-2 items-center">
            <span>
              <GiBoxUnpacking className="text-sm text-primary" />
            </span>
            <span>
              <p className="text-sm">7 Days Easy Return</p>
            </span>
          </div>
          <div className="bg-primary w-[1px] h-4 opacity-50"></div>
          <div className="flex gap-2 items-center">
            <span>
              <RiMoneyRupeeCircleFill className="text-sm text-primary" />
            </span>
            <span>
              <p className="text-sm">Cash on Delivery</p>
            </span>
          </div>
          <div className="bg-primary w-[1px] h-4 opacity-50"></div>
          <div className="flex gap-2 items-center">
            <span>
              <ImPriceTags className="text-sm text-primary" />
            </span>
            <span>
              <p className="text-sm">Lowest Price</p>
            </span>
          </div>
        </div>
      </div>

      <section>
        <Category />
      </section>

      {womenProducts && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-10 animate-in fade-in duration-300">
          <ProductSlider
            title="Latest Arrivals For Women"
            products={womenProducts}
            collectionSlug="women"
          />
        </section>
      )}

      <section className="relative overflow-hidden">
        <CustomImage srcAttr={fashionBanner} altAttr="Fashion Banner" titleAttr="Fashion Banner" />

        <div className="absolute right-6 sm:right-12 md:right-20 top-1/2 -translate-y-1/2 select-none">
          <div className="flex flex-col space-y-2 sm:space-y-4 font-playfair text-white uppercase drop-shadow-md">
            <span className="text-xl sm:text-3xl md:text-5xl font-medium tracking-[0.25em] ml-10 sm:ml-16 md:ml-24 leading-snug">
              Discover Your
            </span>
            <span className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-[0.15em] leading-tight">
              Signature Style
            </span>
          </div>
        </div>
      </section>

      {menProducts && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16 animate-in fade-in duration-300">
          <ProductSlider
            title="Latest Arrivals For Men"
            subtitle="Discover the new standard in menswear fashion essentials."
            products={menProducts}
            collectionSlug="men"
          />
        </section>
      )}
    </div>
  );
};

export default HomePage;
