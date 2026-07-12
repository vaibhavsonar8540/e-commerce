import heroBanner from "@/assets/home/heroBanner.webp";
import HeroBanner from "@/components/heroBanner";
import ProductCard from "@/components/productCard";
import Link from "next/link";
import kurti from "@/assets/kurti.jpg";
import { GiBoxUnpacking } from "react-icons/gi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { ImPriceTags } from "react-icons/im";
import Category from "./category";
import CustomImage from "../customImage";
import coupneOffBanner from "@/assets/home/electronic.webp";

const data = {
  title: "Kurti",
  image: kurti,
  price: 600,
};

const HomePage = () => {
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

      <section className="mt-10">
        <div className="px-16">
          <h2 className="text-primary font-playfair text-4xl font-medium">
            Most Loved
          </h2>

          <div className="w-24 h-1 bg-primary mt-3 rounded-full"></div>
        </div>
        <div>
          
        </div>
      </section>

      {/* <section className="px-10 py-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <ProductCard data={data} />
          <ProductCard data={data} />
          <ProductCard data={data} />
          <ProductCard data={data} />
          <ProductCard data={data} />
        </div>
      </section>

      <section>
        <CustomImage srcAttr={coupneOffBanner} className={"w-full"} />
      </section> */}
    </div>
  );
};

export default HomePage;
