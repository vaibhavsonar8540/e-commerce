"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "@/redux/action/commonAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Tag,
  CheckCircle2,
  X,
  ShieldCheck,
  MapPin,
  Smartphone,
  Mail,
  User,
  Home,
  Navigation,
  Globe,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import { State, City } from "country-state-city";
import api from "@/utils/axiosInstant";
import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";

export default function OrderPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cart, loading } = useSelector((state) => state.common);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Indian States
  const indianStates = State.getStatesOfCountry("IN");

  // Form State
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    country: "India",
    stateCode: "",
    stateName: "",
    city: "",
    roadArea: "",
    pincode: "",
  });

  const [availableCities, setAvailableCities] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  // Pre-fill user profile data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullname: prev.fullname || user.fullname || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Handle State Change -> update available cities list
  const handleStateChange = (e) => {
    const selectedStateIso = e.target.value;
    const selectedStateObj = indianStates.find((s) => s.isoCode === selectedStateIso);
    const stateName = selectedStateObj ? selectedStateObj.name : "";

    setFormData((prev) => ({
      ...prev,
      stateCode: selectedStateIso,
      stateName: stateName,
      city: "",
    }));

    if (selectedStateIso) {
      const cities = City.getCitiesOfState("IN", selectedStateIso);
      setAvailableCities(cities || []);
    } else {
      setAvailableCities([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const items = cart?.items || [];
  const subTotal = cart?.subTotal || 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotalAmount = Math.max(0, subTotal - discountAmount);

  // Apply Coupon Code
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    if (subTotal <= 0) {
      toast.error("Cart subtotal must be greater than 0 to apply coupon.");
      return;
    }

    setApplyingCoupon(true);
    try {
      const res = await api.post("/coupon/apply", {
        code: couponCode.trim(),
        subtotal: subTotal,
      });

      if (res.data?.success) {
        setAppliedCoupon(res.data.data);
        toast.success(res.data.message || "Coupon applied successfully!");
      }
    } catch (err) {
      setAppliedCoupon(null);
      toast.error(err?.response?.data?.message || "Invalid or inapplicable coupon code.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon code removed.");
  };

  // Form Submit -> Validate & Open Payment Screen
  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (
      !formData.fullname.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.stateCode ||
      !formData.city.trim() ||
      !formData.roadArea.trim() ||
      !formData.pincode.trim()
    ) {
      toast.error("All shipping fields marked with (*) are required.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty. Please add items to place an order.");
      return;
    }

    setIsSubmitting(true);

    // Save shipping address & checkout details to session storage
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "checkoutSession",
        JSON.stringify({
          shipping: formData,
          appliedCoupon,
          subTotal,
          discountAmount,
          totalAmount: finalTotalAmount,
        })
      );
    }

    toast.success("Shipping address saved! Opening payment screen...");
    
    // Smooth transition to payment screen
    setTimeout(() => {
      router.push("/payment");
    }, 400);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6 text-center">
        <div className="w-20 h-20 bg-gray-100/80 rounded-3xl flex items-center justify-center text-gray-500 mb-5 shadow-inner">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-playfair">
          Sign In Required
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Please log in to your account to complete your order checkout.
        </p>
        <Link
          href="/"
          className="mt-6 px-7 py-3.5 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl transition duration-200 text-sm shadow-lg hover:shadow-xl cursor-pointer"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-10 px-3 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header & Breadcrumb */}
        <div className="flex flex-col gap-3 sm:gap-4 border-b border-gray-200/80 pb-4 sm:pb-6">
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 self-start text-xs sm:text-sm font-semibold text-gray-700 hover:text-black bg-transparent transition cursor-pointer py-1"
          >
            <ArrowLeft size={16} />
            <span>Back to Cart</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair">
              Checkout & Shipping
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Enter your delivery details and proceed directly to payment.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200/85 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400 mb-4 shadow-inner">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Your Cart is Empty</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
              You don't have any items in your cart. Add products before placing an order.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-900 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md"
              >
                <span>Browse Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* SHIPPING FORM (Cols 7 on Desktop, 2nd on Mobile) */}
            <div className="order-2 lg:order-1 lg:col-span-7 bg-white border border-gray-200/85 p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2.5">
                  <MapPin size={20} className="text-black" />
                  Shipping Address
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Required fields are marked with (<span className="text-red-500">*</span>)
                </p>
              </div>

              <form id="orderForm" onSubmit={handleSubmitForm} className="space-y-4.5">
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="fullname"
                        required
                        placeholder="John Doe"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm font-medium transition bg-gray-50/20 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm font-medium transition bg-gray-50/20 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Smartphone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm font-medium transition bg-gray-50/20 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="country"
                        value="India"
                        readOnly
                        disabled
                        className="w-full border border-gray-200 bg-gray-100/70 text-gray-700 rounded-xl pl-10 pr-3.5 py-2.5 font-semibold text-xs sm:text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: State & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.stateCode}
                      onChange={handleStateChange}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium bg-gray-50/20 focus:bg-white transition cursor-pointer"
                    >
                      <option value="">Select Indian State</option>
                      {indianStates.map((st) => (
                        <option key={st.isoCode} value={st.isoCode}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    {availableCities.length > 0 ? (
                      <select
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium bg-gray-50/20 focus:bg-white transition cursor-pointer"
                      >
                        <option value="">Select City</option>
                        {availableCities.map((ct) => (
                          <option key={ct.name} value={ct.name}>
                            {ct.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder={
                          formData.stateCode
                            ? "Type city name"
                            : "Select state first"
                        }
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm font-medium transition bg-gray-50/20 focus:bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* Row 4: Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Address (Flat, House No, Building) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Home
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="e.g. Flat 402, Sunshine Apartments"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm font-medium transition bg-gray-50/20 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Row 5: Road / Area & Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Road / Area / Street <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Navigation
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="roadArea"
                        required
                        placeholder="e.g. MG Road, Sector 15"
                        value={formData.roadArea}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm font-medium transition bg-gray-50/20 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Pincode / Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="e.g. 400001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black text-xs sm:text-sm font-mono font-semibold transition bg-gray-50/20 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Submit / Place Order Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-2xl text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <span>Opening Payment Screen...</span>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span className="text-base tracking-wide">Place Order</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* ORDER SUMMARY (Cols 5 on Desktop, 1st on Mobile) */}
            <div className="order-1 lg:order-2 lg:col-span-5 bg-white border border-gray-200/85 p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm lg:sticky lg:top-8 space-y-6">
              
              {/* Header */}
              <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-black" />
                  Order Summary ({items.length})
                </h2>
                <span className="text-xs font-semibold text-gray-400">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </div>

              {/* Products List */}
              <div className="max-h-[320px] overflow-y-auto pr-1 custom-scrollbar space-y-3">
                {items.map((item) => {
                  const prod = item.product || {};
                  const imgUrl = getMediaUrl(prod.thumbnail);

                  return (
                    <div
                      key={prod._id || item._id}
                      className="flex items-center gap-3.5 bg-gray-50/80 hover:bg-gray-100/80 p-3 rounded-2xl border border-gray-200/70 transition-all group"
                    >
                      <div className="w-16 h-18 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200 p-1 flex items-center justify-center">
                        <img
                          src={imgUrl}
                          alt={prod.productName || "Product"}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>

                      <div className="grow min-w-0 pr-2">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2 capitalize">
                          {prod.productName}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-[11px] sm:text-xs text-gray-500">
                          <span>
                            Qty: <strong className="text-gray-900">{item.quantity}</strong>
                          </span>
                          {prod.mrp && prod.mrp > prod.price && (
                            <span className="line-through text-gray-400 text-[11px]">
                              ₹{prod.mrp}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-extrabold text-black block">
                          ₹{item.itemTotal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={14} className="text-emerald-600 shrink-0" />
                    Have a Promo Coupon Code?
                  </label>

                  {appliedCoupon ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-emerald-900 font-mono uppercase tracking-wider truncate">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-[11px] text-emerald-700 font-medium">
                            Discount: -₹{appliedCoupon.discountAmount}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-gray-400 hover:text-red-600 p-1 transition cursor-pointer shrink-0"
                        title="Remove coupon"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ENTER COUPON"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 min-w-0 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider outline-none focus:border-black bg-white"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon}
                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
                      >
                        {applyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Subtotal & Total Breakdown */}
                <div className="space-y-2.5 text-xs sm:text-sm font-semibold pt-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">₹{subTotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Tag size={13} />
                        Coupon Discount
                      </span>
                      <span className="font-extrabold">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Charge</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between text-sm sm:text-base font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-lg sm:text-xl text-black">₹{finalTotalAmount}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
