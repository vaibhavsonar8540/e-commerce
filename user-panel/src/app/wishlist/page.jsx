"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist } from "@/redux/action/commonAction";
import ProductCard from "@/components/productCard";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.common);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-5 shadow-inner">
          <Heart size={28} />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-playfair animate-fade-in">
          Please Sign In
        </h2>
        <p className="mt-2 text-sm text-gray-550 max-w-sm">
          You must be logged in to view your wishlist items. Log in to explore your saved favorites.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition duration-200 text-sm shadow-md cursor-pointer animate-bounce"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Navigation & Title */}
        <div className="flex flex-col gap-4 border-b border-gray-200/80 pb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 self-start text-sm font-semibold text-gray-700 hover:text-black bg-transparent transition cursor-pointer py-1"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair">
              My Favorites
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Here are all the items you've bookmarked for later.
            </p>
          </div>
        </div>

        {/* Wishlist Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
            <p className="text-sm font-semibold text-gray-500">Retrieving favorites...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-400 mb-4 shadow-inner">
              <Heart size={26} className="fill-current" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Your Wishlist is Empty</h3>
            <p className="text-sm text-gray-505 leading-relaxed max-w-md mx-auto">
              You haven't added any products to your wishlist yet. Explore our latest arrivals or search for your favorite styles.
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white font-semibold text-sm rounded-xl transition cursor-pointer">
                <span>Browse Products</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((prod) => {
              if (!prod) return null;
              // Map key structure
              const mappedProduct = {
                _id: prod._id,
                productName: prod.productName,
                price: prod.price,
                discountPrice: prod.discountedPrice || prod.discountPrice,
                thumbnail: prod.thumbnail,
                images: prod.images,
                stock: prod.stock
              };
              return (
                <ProductCard key={mappedProduct._id} data={mappedProduct} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
