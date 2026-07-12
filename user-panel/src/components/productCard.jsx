import React from "react";
import Link from "next/link";
import CustomImage from "./customImage";
import { Button } from "./Buttons";
import { FaRegHeart } from "react-icons/fa";

const ProductCard = ({ data }) => {
  return (
    <div className="group w-full relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm
     transition duration-300">
      
      <div className="absolute right-5 top-5">
        <FaRegHeart className="text-mid-grey cursor-pointer text-lg"/>
      </div>
      {/* Product Image */}
      <Link
        href="/"
        className="flex items-center justify-center overflow-hidden bg-white"
      >
        <CustomImage
          srcAttr={data.image}
          altAttr={data.title}
          titleAttr={data.title}
          className="h-60 w-full object-fill transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link
          href="/"
          className="line-clamp-2 text-base text-mid-grey"
        >
          {data.title}
        </Link>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ₹{data.price}
          </span>
        </div>

        <Button className="mt-2 w-full">
          Add To Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;