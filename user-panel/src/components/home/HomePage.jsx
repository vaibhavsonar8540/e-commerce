"use client";

import heroBanner from "@/assets/home/heroBanner.webp";
import HeroBanner from "@/components/heroBanner";
import Link from "next/link";
import kurti from "@/assets/kurti.jpg";
import { GiBoxUnpacking } from "react-icons/gi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { ImPriceTags } from "react-icons/im";
import Category from "./category";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstant";
import ProductSlider from "@/components/productSlider";

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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16 animate-in fade-in duration-300">
          <ProductSlider
            title="Latest Arrivals For Women"
            products={womenProducts}
            collectionSlug="women"
          />
        </section>
      )}

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
