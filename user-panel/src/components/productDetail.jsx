"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCartAction } from "@/redux/action/commonAction";
import { setIsModelOpen, setFlashMessage } from "@/redux/slices/commonSlice";
import {
  ShoppingCart,
  Zap,
  Store,
  MapPin,
  CheckCircle,
  Play,
} from "lucide-react";
import api from "@/utils/axiosInstant";
import ProductSlider from "./productSlider";
import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";

export default function ProductDetail({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.common);

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
        ? product.colors
            .flatMap((c) => (typeof c === "string" ? c.split(",") : c))
            .map((c) => c.trim())
            .filter(Boolean)
        : typeof product.colors === "string" && product.colors.trim()
          ? product.colors
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
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
          api.get("/product/get-filtered", {
            params: { collectionSlug: "men" },
          }),
          api.get("/product/get-filtered", {
            params: { collectionSlug: "women" },
          }),
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
        // catch silently
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
      dispatch(
        setFlashMessage({
          type: "info",
          message: "Please sign-in to purchase items.",
        }),
      );
      dispatch(setIsModelOpen(true));
      return;
    }

    const isAlreadyInCart = cart?.items?.some(
      (item) => (item.product?._id || item.product) === product?._id,
    );

    if (isAlreadyInCart) {
      dispatch(
        setFlashMessage({
          type: "warning",
          message: "Product is already in your cart!",
        }),
      );
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(addToCartAction(product._id, 1));
      dispatch(setFlashMessage({ type: "success", message: "Added to cart!" }));
    } catch (err) {
      dispatch(
        setFlashMessage({
          type: "error",
          message: err?.response?.data?.message || "Error adding item to cart.",
        }),
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      dispatch(
        setFlashMessage({
          type: "info",
          message: "Please sign-in to purchase items.",
        }),
      );
      dispatch(setIsModelOpen(true));
      return;
    }

    const isAlreadyInCart = cart?.items?.some(
      (item) => (item.product?._id || item.product) === product?._id,
    );

    setAddingToCart(true);
    try {
      if (!isAlreadyInCart) {
        await dispatch(addToCartAction(product._id, 1));
      }
      router.push("/order");
    } catch (err) {
      dispatch(
        setFlashMessage({
          type: "error",
          message: err?.response?.data?.message || "Error adding item to cart.",
        }),
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const colorsList = Array.isArray(product?.colors)
    ? product.colors
        .flatMap((c) => (typeof c === "string" ? c.split(",") : c))
        .map((c) => c.trim())
        .filter(Boolean)
    : typeof product?.colors === "string" && product.colors.trim()
      ? product.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : product?.color
        ? [product.color]
        : [];

  const displayPrice = Number(product.price || 0);
  const rawDiscount = product.discountPrice != null ? product.discountPrice : product.discountedPrice;
  const discountPrice = Number(rawDiscount || 0);
  const isDiscounted = Boolean(discountPrice > 0 && displayPrice > discountPrice);
  const finalPrice = isDiscounted ? discountPrice : displayPrice;
  const discountPercent = isDiscounted
    ? Math.round(((displayPrice - discountPrice) / displayPrice) * 100)
    : 0;

  // Media items list
  const galleryImages = (product.images || []).filter(Boolean);
  const allImages = [product.thumbnail, ...galleryImages].filter(Boolean);
  const videoUrl =
    product.videos && product.videos[0] ? getMediaUrl(product.videos[0]) : null;

  // Check if selected image is video
  const isSelectedVideo =
    selectedImage === videoUrl ||
    (selectedImage && selectedImage.includes(".mp4"));

  // Seller / Shop details
  const shopName =
    product.seller?.businessName ||
    product.seller?.fullname ||
    "VELORA OFFICIAL STORE";
  const shopAddress =
    product.seller?.address || "Registered Merchant Store Address";

  // Action Buttons Block (Add to Cart + Buy Now)
  const renderActionButtons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.stock <= 0 || addingToCart}
        className="w-full py-2.5 sm:py-3.5 px-3 sm:px-4 bg-white hover:bg-gray-50 border border-gray-900 disabled:bg-gray-100 disabled:border-gray-300 text-gray-900 font-bold rounded-xl transition duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
      </button>

      <button
        type="button"
        onClick={handleBuyNow}
        disabled={product.stock <= 0 || addingToCart}
        className="w-full py-2.5 sm:py-3.5 px-3 sm:px-4 bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold rounded-xl transition duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
      >
        <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white text-white" />
        <span>Buy Now</span>
      </button>
    </div>
  );

  return (
    <>
      <div className="space-y-4 sm:space-y-8 bg-white p-3 sm:p-6 rounded-md">
        {/* Top Breadcrumb Navigation */}
        <div className="text-[11px] sm:text-xs font-semibold text-gray-500 flex flex-wrap items-center gap-1 sm:gap-1.5 px-0.5 sm:px-1">
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
              <span className="text-gray-800 font-bold">
                {product.subCategory?.name}
              </span>
            </>
          )}
        </div>

        {/* Main Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
          {/* LEFT COLUMN: THUMBNAILS + MAIN IMAGE CONTAINER + (ON LARGE SCREENS: ACTION BUTTONS BELOW IMAGE CONTAINER) */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start">
              {/* Small thumbnail cards list on the left side */}
              <div className="flex sm:flex-col gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-y-auto max-h-[550px] shrink-0 w-full sm:w-auto pb-1.5 sm:pb-0">
                {allImages.map((img, idx) => {
                  const fullUrl = getMediaUrl(img);
                  const isActive = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl overflow-hidden border transition cursor-pointer flex items-center justify-center p-1 shrink-0 ${
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
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-xl overflow-hidden border transition cursor-pointer flex flex-col items-center justify-center p-1 shrink-0 relative ${
                      selectedImage === videoUrl
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Play
                      size={16}
                      className="text-white fill-white sm:size-[18px]"
                    />
                    <span className="text-[8px] sm:text-[9px] font-bold text-white uppercase">
                      Video
                    </span>
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

          {/* RIGHT COLUMN: PRODUCT TITLE, PRICE, SIZES & COLORS, SPECS, SELLER CARD */}
          <div className="lg:col-span-6 space-y-2.5 sm:space-y-3 p-3.5 sm:p-6 bg-white border border-gray-200 rounded-2xl">
            {/* Card 1: Title, Pricing & Stock */}
            <div className="pb-2.5 sm:pb-4">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 tracking-tight capitalize">
                {product.productName}
              </h1>

              {/* Price & Stock Section */}
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-3xl font-extrabold text-gray-900">
                    ₹{finalPrice}
                  </span>
                  {isDiscounted ? (
                    <>
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        ₹{displayPrice}
                      </span>
                      <span className="text-[10px] sm:text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 sm:px-2 rounded border border-emerald-100">
                        {discountPercent}% off onwards
                      </span>
                    </>
                  ) : null}
                </div>

                {/* Stock Status Badge */}
                <div>
                  {product.stock > 0 ? (
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full py-0.5 px-2.5 sm:py-1 sm:px-3 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500"></span>
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-[11px] sm:text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-full py-0.5 px-2.5 sm:py-1 sm:px-3 inline-flex items-center gap-1.5">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Select Size & Select Color (Combined Clean Design) */}
            {((product.sizes && product.sizes.length > 0) ||
              colorsList.length > 0) && (
              <div className="space-y-2.5 sm:space-y-3 pb-2.5 sm:pb-4">
                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800">
                      Select Size
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition border cursor-pointer ${
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

                {/* Color Selector (Directly Below Size with matching design) */}
                {colorsList.length > 0 && (
                  <div
                    className={`space-y-2 sm:space-y-3 ${product.sizes && product.sizes.length > 0 ? "pt-2.5 sm:pt-4 border-t border-gray-100" : ""}`}
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800">
                      Select Color
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {colorsList.map((col, idx) => {
                        const isSelected = selectedColor === col;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedColor(col)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition border capitalize cursor-pointer ${
                              isSelected
                                ? "border-black bg-black text-white shadow-xs"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
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
            )}

            {/* Card 3: Product Highlights & Specifications */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 border-b border-gray-100 pb-1.5 sm:pb-2">
                Product Highlights & Specifications
              </h3>

              {/* Spec grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-[11px] sm:text-sm">
                {product.fabric && (
                  <div>
                    <span className="text-gray-400 font-semibold block">
                      Fabric:
                    </span>
                    <span className="text-gray-800 font-bold capitalize">
                      {product.fabric}
                    </span>
                  </div>
                )}

                {product.brand && (
                  <div>
                    <span className="text-gray-400 font-semibold block">
                      Brand:
                    </span>
                    <span className="text-gray-800 font-bold capitalize">
                      {product.brand}
                    </span>
                  </div>
                )}

                {colorsList.length > 0 && (
                  <div>
                    <span className="text-gray-400 font-semibold block">
                      Color:
                    </span>
                    <span className="text-gray-800 font-bold capitalize">
                      {colorsList.join(", ")}
                    </span>
                  </div>
                )}

                {product.collections?.name && (
                  <div>
                    <span className="text-gray-400 font-semibold block">
                      Collection:
                    </span>
                    <span className="text-gray-800 font-bold capitalize">
                      {product.collections?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-1 sm:space-y-1.5 pt-2 sm:pt-3 border-t border-gray-100">
                  <h4 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Product Description
                  </h4>
                  <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Card 4: Shop / Seller Information Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3.5 sm:p-6 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 sm:pb-2.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 sm:gap-1.5">
                  <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
                  Seller Information
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Verified
                  Seller
                </span>
              </div>

              {/* Shop Name */}
              <h3 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
                {shopName}
              </h3>

              {/* Address */}
              {shopAddress && (
                <div className="flex items-start gap-1.5 text-[11px] sm:text-xs text-gray-600 font-medium pt-0.5 sm:pt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
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
      </div>

      {/* Bottom Section: Space below Seller Info and ONLY Men's Latest Arrivals */}
      <div className="mt-6 sm:mt-10 border-gray-200">
        <ProductSlider
          title="Latest Arrivals For Men"
          products={menArrivals}
          collectionSlug="men"
          loading={loadingSliders}
        />
      </div>
    </>
  );
}
