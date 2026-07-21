import React from "react";
import Link from "next/link";
import CustomImage from "./customImage";
import { Button } from "./Buttons";
import { FaRegHeart } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { addToCartAction } from "@/redux/action/commonAction";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import { toast } from "react-toastify";

const ProductCard = ({ data }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const productId = data._id || data.id || "";
  const title = data.productName || data.title || "Product";
  
  // Resolve image source: check if thumbnail holds raw backend route or use mock image
  const imgUrl = data.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${data.thumbnail}`
    : data.image;

  const priceVal = data.discountPrice || data.price || 0;
  const discountTag = data.discountPrice && data.price && data.price > data.discountPrice
    ? Math.round(((data.price - data.discountPrice) / data.price) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      toast.error("Invalid product details.");
      return;
    }

    if (!isAuthenticated) {
      toast.info("Please sign-in to purchase items.");
      dispatch(setIsModelOpen(true));
      return;
    }

    try {
      await dispatch(addToCartAction(productId, 1));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error adding item to cart.");
    }
  };

  return (
    <div className="group w-full relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Discount Badge */}
      {discountTag && (
        <div className="absolute left-3 top-3 z-10 bg-[#FF6B35] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
          {discountTag}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <div className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm border border-gray-100 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white text-gray-500 hover:text-red-500 transition duration-300">
        <FaRegHeart className="text-xs transition-colors" />
      </div>

      {/* Product Image */}
      <Link
        href={productId ? `/product/${productId}` : "#"}
        className="flex items-center justify-center overflow-hidden bg-gray-50/40 aspect-4/3 p-4"
      >
        <img
          src={imgUrl}
          alt={title}
          title={title}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300";
          }}
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 justify-between border-t border-gray-50/50">
        <div className="space-y-1">
          <Link
            href={productId ? `/product/${productId}` : "#"}
            className="line-clamp-2 text-xs font-bold text-gray-800 hover:text-primary transition capitalize tracking-wide min-h-[32px]"
          >
            {title}
          </Link>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-sm font-extrabold text-primary">
              ₹{priceVal}
            </span>
            {data.discountPrice && data.price && data.price > data.discountPrice && (
              <span className="text-[10px] text-gray-400 font-semibold line-through">₹{data.price}</span>
            )}
          </div>
        </div>

        <Button onClick={handleAddToCart} className="mt-3.5 w-full text-[10px] py-2 bg-primary hover:bg-[#321706] text-white font-extrabold border-none rounded-xl transition cursor-pointer">
          Add To Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;