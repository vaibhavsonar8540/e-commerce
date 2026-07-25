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
import electronicBannerForBigScreen from "@/assets/home/electronicBannerForBigScreen.webp";
import electronicBannerForSmallScreen from "@/assets/home/electronicBannerSmallScreen.webp";
import CustomImage from "../customImage";
import watch1 from "@/assets/home/watch1.webp"
import watch2 from "@/assets/home/watch2.webp"
import decor1 from "@/assets/home/decor1.webp"
import decor2 from "@/assets/home/decor2.webp"
import Link from "next/link";
import { Button, LinkButton } from "../Buttons";

const HomePage = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [beautyProducts, setBeautyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeSliders() {
      try {
        const [menRes, womenRes, beautyRes] = await Promise.all([
          api.get("/product/get-filtered", {
            params: { collectionSlug: "men" },
          }),
          api.get("/product/get-filtered", {
            params: { collectionSlug: "women" },
          }),
          api.get("/product/get-filtered", {
            params: { collectionSlug: "beauty" },
          }),
        ]);
        if (menRes.data?.success) {
          setMenProducts(menRes.data.products.slice(0, 5));
        }
        if (womenRes.data?.success) {
          setWomenProducts(womenRes.data.products.slice(0, 5));
        }
        if (beautyRes.data?.success) {
          setBeautyProducts(beautyRes.data.products.slice(0, 5));
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

      <div className="bg-[#F3F4F6] py-3 px-2 sm:px-5">
        <div className="py-2.5 px-2 sm:px-4 bg-white flex flex-row justify-between sm:justify-center items-center gap-1 sm:gap-4 md:gap-6 lg:gap-8 rounded-md">
          <div className="flex gap-1 sm:gap-2 items-center">
            <span>
              <GiBoxUnpacking className="text-xs sm:text-sm text-primary shrink-0" />
            </span>
            <span>
              <p className="text-[10px] min-[380px]:text-xs sm:text-sm font-medium whitespace-nowrap">7 Days Easy Return</p>
            </span>
          </div>
          <div className="bg-primary w-[1px] h-3.5 sm:h-4 opacity-50 shrink-0"></div>
          <div className="flex gap-1 sm:gap-2 items-center">
            <span>
              <RiMoneyRupeeCircleFill className="text-xs sm:text-sm text-primary shrink-0" />
            </span>
            <span>
              <p className="text-[10px] min-[380px]:text-xs sm:text-sm font-medium whitespace-nowrap">Cash on Delivery</p>
            </span>
          </div>
          <div className="bg-primary w-[1px] h-3.5 sm:h-4 opacity-50 shrink-0"></div>
          <div className="flex gap-1 sm:gap-2 items-center">
            <span>
              <ImPriceTags className="text-xs sm:text-sm text-primary shrink-0" />
            </span>
            <span>
              <p className="text-[10px] min-[380px]:text-xs sm:text-sm font-medium whitespace-nowrap">Lowest Price</p>
            </span>
          </div>
        </div>
      </div>

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
        />

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
        <section className="px-4 sm:px-8 md:px-12 lg:px-16 mt-6 lg:mt-10 animate-in fade-in duration-300">
          <ProductSlider
            title="Latest Arrivals For Men"
            products={menProducts}
            collectionSlug="men"
          />
        </section>
      )}

      <Link href="/collection/electonics" className="block relative overflow-hidden mt-6 lg:mt-10">
        <CustomImage
          srcAttr={electronicBannerForBigScreen}
          altAttr="Electonic Banner"
          titleAttr="Electonic Banner"
          className={"hidden lg:block"}
        />

        <CustomImage
          srcAttr={electronicBannerForSmallScreen}
          altAttr="Electonic Banner"
          titleAttr="Electonic Banner"
          className={"lg:hidden"}
        />

        <div className="absolute right-6 sm:right-12 md:right-20 top-1/2 -translate-y-1/2 select-none">
          <div className="flex flex-col space-y-2 sm:space-y-4  text-black max-w-lg drop-shadow-md">
            <span className="text-xl sm:text-3xl font-playfair uppercase 
            font-medium tracking-[0.25em] leading-snug">
              Upgrade Your Tech Today With Velora
            </span>
            <span className="tracking-[0.15em] leading-tight">
              Discover the latest electronics with premium quality, cutting-edge
              performance, and unbeatable value.
            </span>

            <LinkButton
            href="/collection/electonics"
             className="!bg-transparent hover:!bg-black">
              Explore Collection
            </LinkButton>
          </div>
        </div>
      </Link>

      {beautyProducts && beautyProducts.length > 0 && (
        <section className="px-4 sm:px-8 md:px-12 lg:px-16 my-6 lg:my-10 animate-in fade-in duration-300">
          <ProductSlider
            title="Latest Arrivals In Beauty"
            products={beautyProducts}
            collectionSlug="beauty"
          />
        </section>
      )}

      <section className="flex flex-col md:flex-row w-full mt-6 lg:mt-10">
        <div className="relative w-full md:w-1/2 h-175 overflow-hidden group">
          <CustomImage 
            srcAttr={watch1}
            altAttr={"Watch collection"}
            titleAttr={"Watch collection"}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover"
          />

          <LinkButton
            href={"/collection/watches"}
            className="absolute left-1/2 -translate-x-1/2 bottom-10 bg-white! border-none! text-black! font-semibold hover:bg-gray-100! transition-colors whitespace-nowrap"
          >
            Watch Collection
          </LinkButton>
        </div>

        <div className="relative w-full md:w-1/2 h-175 overflow-hidden group">
          <CustomImage 
            srcAttr={decor1}
            altAttr={"Home and Kitchen collection"}
            titleAttr={"Home and Kitchen collection"}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover"
          />

          <LinkButton
            href={"/collection/home-and-kitchen"}
            className="absolute left-1/2 -translate-x-1/2 bottom-10 bg-white! border-none! text-black! font-semibold hover:bg-gray-100! transition-colors whitespace-nowrap"
          >
            Home and Kitchen Collection
          </LinkButton>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
