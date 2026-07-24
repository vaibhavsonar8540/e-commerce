"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAction } from "@/redux/action/commonAction";
import { setIsModelOpen, setIsCartOpen } from "@/redux/slices/commonSlice";
import { ShoppingCart, Zap, Store, MapPin, CheckCircle, Play } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/utils/axiosInstant";
import ProductSlider from "./productSlider";
import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";

export default function ProductDetail({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(product?.thumbnail || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [menArrivals, setMenArrivals] = useState([]);
  const [womenArrivals, setWomenArrivals] = useState([]);
  const [loadingSliders, setLoadingSliders] = useState(true);

  // Initialize size and colors
  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      const initialColors = Array.isArray(product.colors)
        ? product.colors.flatMap((c) => (typeof c === "string" ? c.split(",") : c)).map((c) => c.trim()).filter(Boolean)
        : typeof product.colors === "string" && product.colors.trim()
        ? product.colors.split(",").map((c) => c.trim()).filter(Boolean)
        : product.color
        ? [product.color]
        : [];
      if (initialColors.length > 0) {
        setSelectedColor(initialColors[0]);
      }
    }
  }, [product]);

  // Fetch separate Men's and Women's latest arrivals
  useEffect(() => {
    async function fetchArrivals() {
      try {
        const [menRes, womenRes] = await Promise.all([
          api.get("/product/get-filtered", { params: { collectionSlug: "men" } }),
          api.get("/product/get-filtered", { params: { collectionSlug: "women" } }),
        ]);
        if (menRes.data?.success) {
          const filteredMen = menRes.data.products
            .filter((p) => p._id !== product?._id)
            .slice(0, 5);
          setMenArrivals(filteredMen);
        }
        if (womenRes.data?.success) {
          const filteredWomen = womenRes.data.products
            .filter((p) => p._id !== product?._id)
            .slice(0, 5);
          setWomenArrivals(filteredWomen);
        }
      } catch (err) {
        console.error("Error fetching arrivals on details page:", err);
      } finally {
        setLoadingSliders(false);
      }
    }
    if (product) {
      fetchArrivals();
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

  const handleBuyNow = async () => {
    await handleAddToCart();
  };

  const colorsList = Array.isArray(product?.colors)
    ? product.colors.flatMap((c) => (typeof c === "string" ? c.split(",") : c)).map((c) => c.trim()).filter(Boolean)
    : typeof product?.colors === "string" && product.colors.trim()
    ? product.colors.split(",").map((c) => c.trim()).filter(Boolean)
    : product?.color
    ? [product.color]
    : [];

  const displayPrice = product.price;
  const isDiscounted = product.discountPrice && product.discountPrice > 0;
  const finalPrice = isDiscounted ? product.discountPrice : displayPrice;
  const discountPercent = isDiscounted
    ? Math.round(((displayPrice - product.discountPrice) / displayPrice) * 100)
    : 0;

  // Media items list
  const galleryImages = (product.images || []).filter(Boolean);
  const allImages = [product.thumbnail, ...galleryImages].filter(Boolean);
  const videoUrl = product.videos && product.videos[0]
    ? getMediaUrl(product.videos[0])
    : null;

  // Check if selected image is video
  const isSelectedVideo = selectedImage === videoUrl || (selectedImage && selectedImage.includes(".mp4"));

  // Seller / Shop details
  const shopName = product.seller?.businessName || product.seller?.fullname || "VELORA OFFICIAL STORE";
  const shopAddress = product.seller?.address || "Registered Merchant Store Address";

  // Action Buttons Block (Add to Cart + Buy Now)
  const renderActionButtons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.stock <= 0 || addingToCart}
        className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 border border-gray-900 disabled:bg-gray-100 disabled:border-gray-300 text-gray-900 font-bold rounded-xl transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <ShoppingCart size={18} />
        <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
      </button>

      <button
        type="button"
        onClick={handleBuyNow}
        disabled={product.stock <= 0 || addingToCart}
        className="w-full py-3.5 px-4 bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold rounded-xl transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
      >
        <Zap size={18} className="fill-white text-white" />
        <span>Buy Now</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-8 bg-white p-6 rounded-md">
      {/* Top Breadcrumb Navigation */}
      <div className="text-xs font-semibold text-gray-500 flex flex-wrap items-center gap-1.5 px-1">
        <span className="text-primary font-bold">Home</span>
        <span>/</span>
        <span>{product.collections?.name || "Collection"}</span>
        {product.category?.name && (
          <>
            <span>/</span>
            <span>{product.category?.name}</span>
          </>
        )}
        {product.subCategory?.name && (
          <>
            <span>/</span>
            <span className="text-gray-800 font-bold">{product.subCategory?.name}</span>
          </>
        )}
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THUMBNAILS + MAIN IMAGE CONTAINER + (ON LARGE SCREENS: ACTION BUTTONS BELOW IMAGE CONTAINER) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-col-reverse sm:flex-row gap-4 items-start">
            
            {/* Small thumbnail cards list on the left side */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[550px] shrink-0 w-full sm:w-auto pb-2 sm:pb-0">
              {allImages.map((img, idx) => {
                const fullUrl = getMediaUrl(img);
                const isActive = selectedImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl overflow-hidden border transition cursor-pointer flex items-center justify-center p-1 shrink-0 ${
                      isActive
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={fullUrl}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                      }}
                    />
                  </button>
                );
              })}

              {/* Video Thumbnail Button if video exists */}
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedImage(videoUrl)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-xl overflow-hidden border transition cursor-pointer flex flex-col items-center justify-center p-1 shrink-0 relative ${
                    selectedImage === videoUrl
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Play size={18} className="text-white fill-white" />
                  <span className="text-[9px] font-bold text-white uppercase">Video</span>
                </button>
              )}
            </div>

            {/* Main Active Image / Video Display Container */}
            <div className="flex-1 w-full aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center p-2">
              {isSelectedVideo ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <img
                  src={getMediaUrl(selectedImage)}
                  alt={product.productName}
                  className="w-full h-full object-contain transition-all duration-300"
                  onError={(e) => {
                    e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                  }}
                />
              )}
            </div>
          </div>

          {/* LARGE SCREENS ONLY: ACTION BUTTONS BELOW IMAGE CONTAINER */}
          <div className="hidden lg:block w-full pt-1">
            {renderActionButtons()}
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT TITLE, PRICE, SIZES, STOCK, DETAILS, SELLER CARD */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Card 1: Title & Pricing */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight capitalize">
              {product.productName}
            </h1>

            {/* Price section */}
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">₹{finalPrice}</span>
              {isDiscounted && (
                <>
                  <span className="text-sm text-gray-400 line-through">₹{displayPrice}</span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {discountPercent}% off onwards
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Select Size */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-gray-800">Select Size</h3>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card 3: Stock Status & Available Colors */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              {product.stock > 0 ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full py-1.5 px-4 inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-full py-1.5 px-4 inline-flex items-center gap-2">
                  Out of Stock
                </span>
              )}
            </div>

            {colorsList.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Color:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {colorsList.map((col, idx) => {
                    const isSelected = selectedColor === col;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition border capitalize cursor-pointer ${
                          isSelected
                            ? "border-black bg-black text-white shadow-sm"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Product Highlights & Specifications (Fabric, Design, Description) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Product Highlights & Specifications
            </h3>

            {/* Spec grid */}
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              {product.fabric && (
                <div>
                  <span className="text-gray-400 font-semibold block">Fabric:</span>
                  <span className="text-gray-800 font-bold capitalize">{product.fabric}</span>
                </div>
              )}

              {product.brand && (
                <div>
                  <span className="text-gray-400 font-semibold block">Brand:</span>
                  <span className="text-gray-800 font-bold capitalize">{product.brand}</span>
                </div>
              )}

              {colorsList.length > 0 && (
                <div>
                  <span className="text-gray-400 font-semibold block">Color:</span>
                  <span className="text-gray-800 font-bold capitalize">{colorsList.join(", ")}</span>
                </div>
              )}

              {product.collections?.name && (
                <div>
                  <span className="text-gray-400 font-semibold block">Collection:</span>
                  <span className="text-gray-800 font-bold capitalize">{product.collections?.name}</span>
                </div>
              )}
            </div>

            {/* Description directly below specs */}
            {product.description && (
              <div className="space-y-1.5 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Product Description
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Card 5: Shop / Seller Information Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Store size={15} className="text-purple-700" />
                Seller Information
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle size={11} /> Verified Seller
              </span>
            </div>

            {/* Big Shop Name */}
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
              {shopName}
            </h3>

            {/* Address */}
            {shopAddress && (
              <div className="flex items-start gap-2 text-xs text-gray-600 font-medium pt-1">
                <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                <span>{shopAddress}</span>
              </div>
            )}
          </div>

          {/* SMALL & MEDIUM SCREENS ONLY: ACTION BUTTONS BELOW SELLER INFORMATION */}
          <div className="block lg:hidden w-full pt-1">
            {renderActionButtons()}
          </div>
        </div>
      </div>

      {/* Bottom Sliders: Separated Arrivals for Men & Women */}
      <div className="pt-8 border-t border-gray-200 space-y-12">
        {loadingSliders ? (
          <div className="flex justify-center items-center py-6">
            <span className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></span>
          </div>
        ) : (
          <>
            {menArrivals.length > 0 && (
              <div>
                <ProductSlider
                  title="Latest Arrivals For Men"
                  subtitle="Browse corresponding trends from our popular Men's classification."
                  products={menArrivals}
                  collectionSlug="men"
                />
              </div>
            )}

            {womenArrivals.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <ProductSlider
                  title="Latest Arrivals For Women"
                  subtitle="Browse corresponding trends from our popular Women's classification."
                  products={womenArrivals}
                  collectionSlug="women"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}