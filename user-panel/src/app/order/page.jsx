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
  Lock,
  Smartphone,
  Mail,
  User,
  Home,
  Navigation,
  Globe,
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

  // States list for India ("IN")
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

  // Available cities for selected state
  const [availableCities, setAvailableCities] = useState([]);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // OTP State & Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  // Lock page scroll when OTP modal is open
  useEffect(() => {
    if (showOtpModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showOtpModal]);

  // 60-second countdown timer for OTP expiration
  useEffect(() => {
    let interval = null;
    if (showOtpModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  // Pre-fill user data
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

  // Handle State Change -> update cities
  const handleStateChange = (e) => {
    const selectedStateIso = e.target.value;
    const selectedStateObj = indianStates.find((s) => s.isoCode === selectedStateIso);
    const stateName = selectedStateObj ? selectedStateObj.name : "";

    setFormData((prev) => ({
      ...prev,
      stateCode: selectedStateIso,
      stateName: stateName,
      city: "", // reset city when state changes
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

  // Form Submit -> Send OTP & Open Modal Immediately
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // Mandatory Fields Validation
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
      toast.error("All fields are mandatory. Please complete the entire form.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty. Cannot place an order.");
      return;
    }

    // Open modal immediately for instant UI response, reset input & timer
    setOtpInput("");
    setOtpTimer(60);
    setShowOtpModal(true);
    setVerifyingOtp(true);

    try {
      const res = await api.post("/user/send-order-otp", {
        email: formData.email,
        phone: formData.phone,
      });

      if (res.data?.success) {
        toast.success(`OTP code sent to ${formData.email}! Please check your inbox.`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Verify OTP & Complete Order -> Navigate to Checkout Success
  const handleVerifyOtpAndCheckout = async (e) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    setSubmittingOrder(true);
    try {
      const verifyRes = await api.post("/user/verify-order-otp", {
        email: formData.email,
        phone: formData.phone,
        otp: otpInput.trim(),
      });

      if (verifyRes.data?.success) {
        toast.success("OTP verified successfully! Redirecting to payment options...");
        setShowOtpModal(false);
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
        router.push("/payment");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP code or order failed.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 mb-5 shadow-inner">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-playfair">
          Please Sign In
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          You must be logged in to place an order.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition duration-200 text-sm shadow-md cursor-pointer"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-10 px-3 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-3 sm:gap-4 border-b border-gray-200/80 pb-4 sm:pb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 self-start px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Cart</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair">
              Place Your Order
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Enter your shipping information and apply promo coupons to complete checkout.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400 mb-4 shadow-inner">
              <ShoppingBag size={26} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Your Cart is Empty</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
              Please add items to your cart before proceeding to order.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
              >
                <span>Start Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* LEFT SIDE: MANDATORY SHIPPING FORM (Cols 7) */}
            <div className="lg:col-span-7 bg-white border border-gray-200/85 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm space-y-5 sm:space-y-6 flex flex-col justify-between">
              <div className="space-y-5 sm:space-y-6">
                <div className="border-b border-gray-100 pb-3.5">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={18} className="text-black shrink-0" />
                    Shipping & Delivery Address
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    All fields marked with (<span className="text-red-500">*</span>) are mandatory.
                  </p>
                </div>

                <form id="orderForm" onSubmit={handleSubmitForm} className="space-y-4 sm:space-y-4.5">
                  {/* Row 1: Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
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
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
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
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Phone & Country (India - fixed without green badge) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
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
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
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
                          className="w-full border border-gray-200 bg-gray-100 text-gray-700 rounded-xl pl-10 pr-3.5 py-2.5 font-semibold text-xs sm:text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: State & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.stateCode}
                        onChange={handleStateChange}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium bg-white transition cursor-pointer"
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      {availableCities.length > 0 ? (
                        <select
                          required
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium bg-white transition cursor-pointer"
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
                          className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium transition"
                        />
                      )}
                    </div>
                  </div>

                  {/* Row 4: Address (Flat, House No, Building) - BELOW STATE & CITY */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
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
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  {/* Row 5: Road / Area & Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
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
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Pincode / Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        placeholder="e.g. 400001"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-xs sm:text-sm font-mono font-semibold transition"
                      />
                    </div>
                  </div>

                  {/* Submit Order Form Button */}
                  <div className="pt-3 sm:pt-4">
                    <button
                      type="submit"
                      disabled={verifyingOtp}
                      className="w-full py-3.5 sm:py-4 bg-black hover:bg-gray-900 text-white font-bold rounded-xl sm:rounded-2xl transition shadow-lg hover:shadow-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {verifyingOtp ? (
                        <span>Sending OTP...</span>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Send OTP & Place Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT SIDE: FULL HEIGHT ITEMS TO BUY & COUPON INPUT (Cols 5) */}
            <div className="lg:col-span-5 bg-white border border-gray-200/85 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm lg:sticky lg:top-8 flex flex-col justify-between h-full space-y-5 sm:space-y-6">
              
              {/* Header */}
              <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-3.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-black" />
                  Items to Buy ({items.length})
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  Total: {items.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </h2>

              {/* Scrollable Product Items Section (Fills Available Height with Scrollbar) */}
              <div className="flex-1 min-h-[160px] max-h-[320px] sm:max-h-[380px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar space-y-3">
                {items.map((item) => {
                  const prod = item.product || {};
                  const imgUrl = getMediaUrl(prod.thumbnail);

                  return (
                    <div
                      key={prod._id}
                      className="flex items-center gap-3.5 bg-gray-50/80 hover:bg-gray-100/80 p-3 rounded-2xl border border-gray-200/70 transition-all shadow-2xs group"
                    >
                      {/* Product Thumbnail (Well Proportioned) */}
                      <div className="w-16 h-18 sm:w-18 sm:h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200 p-1 flex items-center justify-center">
                        <img
                          src={imgUrl}
                          alt={prod.productName}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>

                      {/* Details & Specs */}
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

                      {/* Total Item Price */}
                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-extrabold text-black block">
                          ₹{item.itemTotal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Section: Coupon & Subtotal */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                {/* COUPON CODE INPUT BOX (ON TOP OF SUBTOTAL) */}
                <div className="bg-gray-50 p-3.5 sm:p-4 rounded-2xl border border-gray-200 space-y-2.5 sm:space-y-3">
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={14} className="text-emerald-600 shrink-0" />
                    Have a Promo Coupon Code?
                  </label>

                  {appliedCoupon ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 sm:p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-emerald-900 font-mono uppercase tracking-wider truncate">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-emerald-700 font-medium">
                            Discount Applied: -₹{appliedCoupon.discountAmount}
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
                        placeholder="ENTER COUPON CODE"
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

                {/* SUBTOTAL AND TOTAL BREAKDOWN */}
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

      {/* OTP VERIFICATION MODAL OVERLAY WITH BLUR & SCROLL LOCK */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative space-y-6 border border-gray-100 mx-2 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>

            {/* Header / Lock Icon */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                <Lock size={26} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-playfair">
                  Verify OTP for Checkout
                </h3>
                <p className="text-xs font-semibold text-emerald-600 max-w-xs mx-auto mt-1">
                  You are one step away for buying product
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Code sent to <span className="font-bold text-gray-800">{formData.email || formData.phone}</span>
                </p>

                {/* Live 1-minute (60s) countdown timer */}
                {otpTimer > 0 ? (
                  <p className="text-xs font-semibold text-amber-600 mt-1">
                    OTP expires in: <span className="font-mono font-bold text-amber-700">00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                  </p>
                ) : (
                  <p className="text-xs font-bold text-red-500 mt-1">
                    OTP Expired! Please click "Resend OTP" below.
                  </p>
                )}
              </div>
            </div>

            {/* OTP Form without autofill display */}
            <form onSubmit={handleVerifyOtpAndCheckout} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 text-center mb-2">
                  ENTER 6-DIGIT VERIFICATION CODE
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  autoComplete="one-time-code"
                  placeholder="------"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center tracking-[0.5em] font-mono font-extrabold text-2xl sm:text-3xl border-2 border-gray-200 rounded-2xl py-3.5 outline-none focus:border-black transition bg-gray-50/50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingOrder}
                className="w-full py-4 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl transition shadow-lg hover:shadow-xl text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingOrder ? (
                  <span>Verifying & Placing Order...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Verify OTP & Complete Order</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSubmitForm}
                  disabled={verifyingOtp}
                  className="text-xs font-semibold text-gray-500 hover:text-black transition cursor-pointer underline disabled:opacity-50"
                >
                  {verifyingOtp ? "Resending..." : "Didn't receive email? Resend OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
