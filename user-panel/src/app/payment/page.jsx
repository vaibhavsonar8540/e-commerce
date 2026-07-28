"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "@/redux/action/commonAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Banknote,
  QrCode,
  Building2,
  Lock,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/utils/axiosInstant";
import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cart } = useSelector((state) => state.common);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }

    if (typeof window !== "undefined") {
      const savedSession = sessionStorage.getItem("checkoutSession");
      if (savedSession) {
        try {
          setCheckoutData(JSON.parse(savedSession));
        } catch (e) {
          console.error("Failed to parse checkout session", e);
        }
      }
    }
  }, [dispatch, isAuthenticated]);

  const items = cart?.items || [];
  const subTotal = checkoutData?.subTotal || cart?.subTotal || 0;
  const discountAmount = checkoutData?.discountAmount || 0;
  const finalTotalAmount = checkoutData?.totalAmount || Math.max(0, subTotal - discountAmount);
  const shipping = checkoutData?.shipping || {};

  const handlePlaceFinalOrder = async () => {
    setSubmittingPayment(true);
    try {
      const fullShippingAddress = shipping.address
        ? `${shipping.address}, ${shipping.roadArea || ""}, ${shipping.city}, ${
            shipping.stateName || ""
          }, India - ${shipping.pincode} (Recipient: ${shipping.fullname}, Phone: ${
            shipping.phone
          }, Email: ${shipping.email})`
        : "Standard Address";

      const orderRes = await api.post("/order/place-order", {
        shippingAddress: fullShippingAddress,
        paymentId: `${selectedMethod}_${Date.now()}`,
        discountAmount: discountAmount,
        couponCode: checkoutData?.appliedCoupon?.code || "",
      });

      if (orderRes.data?.success) {
        toast.success("Order placed successfully!");
        dispatch(fetchCart());
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "lastOrder",
            JSON.stringify({
              order: orderRes.data.data,
              shipping: shipping,
              appliedCoupon: checkoutData?.appliedCoupon,
              subTotal,
              discountAmount,
              totalAmount: finalTotalAmount,
              paymentMethod: selectedMethod,
            })
          );
          sessionStorage.removeItem("checkoutSession");
        }
        router.push("/checkout-success");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to complete payment and place order.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <ShoppingBag size={32} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-bold">Please sign in to proceed</h2>
        <Link href="/" className="mt-4 px-6 py-2.5 bg-black text-white font-semibold rounded-xl text-sm">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-10 px-3 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-3 sm:gap-4 border-b border-gray-200/80 pb-4 sm:pb-6">
          <button
            onClick={() => router.push("/order")}
            className="flex items-center gap-2 self-start px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Shipping Address</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair">
              Select Payment Method
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              OTP Verified! Complete your payment selection to place your order securely.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT SIDE: PAYMENT OPTIONS (Cols 7) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard size={20} className="text-black" />
              Payment Options
            </h2>

            <div className="space-y-3.5">
              {/* Option 1: Cash on Delivery (COD) */}
              <div
                onClick={() => setSelectedMethod("COD")}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  selectedMethod === "COD"
                    ? "border-black bg-gray-50/80 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Banknote size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                      Cash on Delivery (COD)
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Recommended
                      </span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      Pay easily with cash or UPI upon delivery at your doorstep.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === "COD"
                        ? "border-black bg-black text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "COD" && <CheckCircle2 size={14} />}
                  </div>
                </div>
              </div>

              {/* Option 2: UPI / QR */}
              <div
                onClick={() => setSelectedMethod("UPI")}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  selectedMethod === "UPI"
                    ? "border-black bg-gray-50/80 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <QrCode size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      UPI / Instant QR Payment
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      Google Pay, PhonePe, Paytm & BHIM UPI.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === "UPI"
                        ? "border-black bg-black text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "UPI" && <CheckCircle2 size={14} />}
                  </div>
                </div>
              </div>

              {/* Option 3: Credit / Debit Card */}
              <div
                onClick={() => setSelectedMethod("CARD")}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  selectedMethod === "CARD"
                    ? "border-black bg-gray-50/80 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      Credit / Debit Card
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      Visa, MasterCard, RuPay & Maestro cards.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === "CARD"
                        ? "border-black bg-black text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "CARD" && <CheckCircle2 size={14} />}
                  </div>
                </div>
              </div>

              {/* Option 4: Net Banking */}
              <div
                onClick={() => setSelectedMethod("NETBANKING")}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  selectedMethod === "NETBANKING"
                    ? "border-black bg-gray-50/80 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      Net Banking
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      All major Indian banks supported.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === "NETBANKING"
                        ? "border-black bg-black text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "NETBANKING" && <CheckCircle2 size={14} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address Preview */}
            {shipping.fullname && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <MapPin size={14} className="text-black" />
                  Delivering To:
                </div>
                <p className="text-xs font-bold text-gray-900">{shipping.fullname}</p>
                <p className="text-xs text-gray-600">
                  {shipping.address}, {shipping.roadArea}, {shipping.city}, {shipping.stateName} - {shipping.pincode}
                </p>
                <p className="text-xs text-gray-500 font-mono">Phone: {shipping.phone}</p>
              </div>
            )}

            {/* Complete Purchase Button */}
            <button
              onClick={handlePlaceFinalOrder}
              disabled={submittingPayment}
              className="w-full py-4 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl transition shadow-xl text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submittingPayment ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Complete Payment & Place Order</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT SIDE: FINAL ORDER SUMMARY (Cols 5) */}
          <div className="lg:col-span-5 bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag size={18} />
                Order Summary ({items.length})
              </span>
            </h2>

            {/* Product items list */}
            <div className="space-y-3 max-h-75 overflow-y-auto pr-1 custom-scrollbar">
              {items.map((item) => {
                const prod = item.product || {};
                const imgUrl = getMediaUrl(prod.thumbnail);

                return (
                  <div
                    key={prod._id}
                    className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-100"
                  >
                    <img
                      src={imgUrl}
                      alt={prod.productName}
                      className="w-14 h-16 object-cover rounded-xl border border-gray-200 shrink-0"
                      onError={(e) => {
                        e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="grow min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1 capitalize">
                        {prod.productName}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Qty: <strong className="text-gray-900">{item.quantity}</strong>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-black">
                        ₹{item.itemTotal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs sm:text-sm font-semibold">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">₹{subTotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Tag size={13} />
                    Coupon Discount ({checkoutData?.appliedCoupon?.code})
                  </span>
                  <span className="font-extrabold">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Delivery Charge</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between text-sm sm:text-base font-extrabold text-gray-900">
                <span>Total Amount Payable</span>
                <span className="text-lg sm:text-xl text-black">₹{finalTotalAmount}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800">
              <Lock size={16} className="shrink-0 text-emerald-600" />
              <span>100% Secure Checkout & Guaranteed Fast Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
