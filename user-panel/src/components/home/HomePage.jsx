"use client";

import heroBanner from "@/assets/home/heroBanner.webp";
import HeroBanner from "@/components/heroBanner";
import KeyFeatures from "@/components/keyFeatures";
import OtherCollection from "@/components/otherCollection";
import Category from "./category";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstant";
import ProductSlider from "@/components/productSlider";
import fashionBanner from "@/assets/home/fashionBanner.webp";
import electronicBannerForBigScreen from "@/assets/home/electronicBannerForBigScreen.webp";
import electronicBannerForSmallScreen from "@/assets/home/electronicBannerSmallScreen.webp";
import CustomImage from "../customImage";
import Link from "next/link";
import { Button, LinkButton } from "../Buttons";

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

      <Link href="/collection/electronics" className="block relative overflow-hidden mt-6 lg:mt-10">
        <CustomImage
          srcAttr={electronicBannerForBigScreen}
          altAttr="Electronic Banner"
          titleAttr="Electronic Banner"
          className={"hidden lg:block"}
        />

        <CustomImage
          srcAttr={electronicBannerForSmallScreen}
          altAttr="Electronic Banner"
          titleAttr="Electronic Banner"
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
            href="/collection/electronics"
             className="!bg-transparent hover:!bg-black">
              Explore Collection
            </LinkButton>
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
