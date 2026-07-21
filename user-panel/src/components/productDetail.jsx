"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAction } from "@/redux/action/commonAction";
import { setIsModelOpen, setIsCartOpen } from "@/redux/slices/commonSlice";
import { ShoppingCart, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/utils/axiosInstant";
import ProductSlider from "./productSlider";

export default function ProductDetail({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(product?.thumbnail || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [menArrivals, setMenArrivals] = useState([]);
  const [loadingMen, setLoadingMen] = useState(true);

  // Initialize size and colors
  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  // Fetch Men's latest arrivals
  useEffect(() => {
    async function fetchMenArrivals() {
      try {
        const response = await api.get("/product/get-filtered", {
          params: { collectionSlug: "men" },
        });
        if (response.data?.success) {
          // Exclude current product if it belongs to Men's collection
          const filtered = response.data.products
            .filter((p) => p._id !== product?._id)
            .slice(0, 5);
          setMenArrivals(filtered);
        }
      } catch (err) {
        console.error("Error fetching men arrivals on details page:", err);
      } finally {
        setLoadingMen(false);
      }
    }
    if (product) {
      fetchMenArrivals();
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign-in to purchase items.");
      dispatch(setIsModelOpen(true));
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(addToCartAction(product._id, 1));
      toast.success("Added to cart!");
      dispatch(setIsCartOpen(true));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error adding item to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const displayPrice = product.price;
  const isDiscounted = product.discountPrice && product.discountPrice > 0;
  const finalPrice = isDiscounted ? product.discountPrice : displayPrice;
  const discountPercent = isDiscounted
    ? Math.round(((displayPrice - product.discountPrice) / displayPrice) * 100)
    : 0;

  // Gather all preview components: thumbnail in list, plus gallery images, plus video
  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);
  const videoUrl = product.videos && product.videos[0]
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${product.videos[0]}`
    : null;

  return (
    <div className="space-y-12">
      {/* 2-Column Detail Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
        
        {/* LEFT SIDE: PRODUCT IMAGES & VIDEOS */}
        <div className="space-y-4">
          {/* Main Thumbnail View (top active preview) */}
          <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center transition-all duration-300">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${selectedImage}`}
              alt={product.productName}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600";
              }}
            />
          </div>

          {/* Underneath: Grid grid-cols-2 showing other images and video */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Show other images */}
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`aspect-square w-full bg-gray-50 rounded-xl overflow-hidden border transition cursor-pointer flex items-center justify-center ${
                  selectedImage === img
                    ? "border-[#47230B] ring-2 ring-[#47230B]/10 shadow"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${img}`}
                  alt={`Product view ${idx + 1}`}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150";
                  }}
                />
              </button>
            ))}

            {/* Video preview container inside the grid */}
            {videoUrl && (
              <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center p-1.5">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain rounded-lg"
                  poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=300"
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: PRODUCT DETAILS */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Breadcrumb style details */}
            <div className="text-xs font-bold uppercase tracking-wider text-[#47230B]/60 flex flex-wrap gap-1.5">
              <span>{product.collections?.name}</span>
              {product.category?.name && (
                <>
                  <span>/</span>
                  <span>{product.category?.name}</span>
                </>
              )}
              {product.subCategory?.name && (
                <>
                  <span>/</span>
                  <span>{product.subCategory?.name}</span>
                </>
              )}
            </div>

            {/* Title & Brand info */}
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-[#47230B] tracking-tight font-playfair capitalize">
                {product.productName}
              </h1>
              {product.brand && (
                <p className="text-sm font-semibold text-gray-400">Brand: {product.brand}</p>
              )}
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-4 py-2 border-y border-gray-100">
              <span className="text-3xl font-bold text-[#47230B]">₹{finalPrice}</span>
              {isDiscounted && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{displayPrice}</span>
                  <span className="text-sm font-bold text-red-500">({discountPercent}% OFF)</span>
                </>
              )}
            </div>

            {/* Sizes selectors */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors selectors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer capitalize ${
                        selectedColor === color
                          ? "bg-[#47230B] text-white border-[#47230B]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock description */}
            <div className="pt-2">
              {product.stock > 0 ? (
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg py-1.5 px-3 inline-block">
                  In Stock: {product.stock} units available
                </p>
              ) : (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg py-1.5 px-3 inline-block">
                  Temporarily Out of Stock
                </p>
              )}
            </div>

            {/* Add to Cart button controls */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingToCart}
                className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold rounded-2xl transition duration-200 text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart size={16} />
                <span>{addingToCart ? "Adding to Cart..." : "Add to Cart"}</span>
              </button>
            </div>
          </div>

          {/* Guarantees bar */}
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6 mt-6">
            <div className="flex flex-col items-center text-center space-y-1">
              <Truck size={18} className="text-[#47230B]" />
              <p className="text-[10px] font-bold text-gray-600">Free Shipping</p>
              <p className="text-[9px] text-gray-405 font-medium">Above ₹999</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-1 border-x border-gray-100">
              <RefreshCw size={18} className="text-[#47230B]" />
              <p className="text-[10px] font-bold text-gray-600">7-Day Returns</p>
              <p className="text-[9px] text-gray-405 font-medium">Easy & free</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-1">
              <ShieldCheck size={18} className="text-[#47230B]" />
              <p className="text-[10px] font-bold text-gray-600">100% Genuine</p>
              <p className="text-[9px] text-gray-405 font-medium">Brand direct</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main product description */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-xl font-bold font-playfair text-[#47230B]">Product Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
      </div>

      {/* Men arrivals slider listed below product */}
      <div className="space-y-6 pt-4">
        {loadingMen ? (
          <div className="flex justify-center items-center py-6">
            <span className="w-6 h-6 border-2 border-[#47230B]/20 border-t-[#47230B] rounded-full animate-spin"></span>
          </div>
        ) : menArrivals.length > 0 ? (
          <div className="animate-in fade-in duration-300">
            <ProductSlider
              title="Latest Arrivals For Men"
              subtitle="Browse corresponding trends from our popular Men's classification."
              products={menArrivals}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}