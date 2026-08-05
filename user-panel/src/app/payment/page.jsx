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
  Sparkles,
  Zap,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/utils/axiosInstant";
import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";

// Helper function to load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cart } = useSelector((state) => state.common);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("RAZORPAY"); // Default to Razorpay
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
          // catch silently
        }
      }
    }
  }, [dispatch, isAuthenticated]);

  const items = cart?.items || [];
  const subTotal = checkoutData?.subTotal || cart?.subTotal || 0;
  const discountAmount = checkoutData?.discountAmount || 0;
  const finalTotalAmount = checkoutData?.totalAmount || Math.max(0, subTotal - discountAmount);
  const shipping = checkoutData?.shipping || {};

  const fullShippingAddress = shipping.address
    ? `${shipping.address}, ${shipping.roadArea || ""}, ${shipping.city}, ${
        shipping.stateName || ""
      }, India - ${shipping.pincode} (Recipient: ${shipping.fullname}, Phone: ${
        shipping.phone
      }, Email: ${shipping.email})`
    : "Standard Delivery Address";

  // Execute Order Creation In Database
  const completeOrderPlacement = async (paymentRefId, methodUsed) => {
    const orderRes = await api.post("/order/place-order", {
      shippingAddress: fullShippingAddress,
      paymentId: paymentRefId,
      paymentMethod: methodUsed,
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
            paymentMethod: methodUsed,
          })
        );
        sessionStorage.removeItem("checkoutSession");
      }
      router.push("/checkout-success");
    } else {
      throw new Error(orderRes.data?.message || "Order creation failed.");
    }
  };

  // Main Handle Place Final Order Function
  const handlePlaceFinalOrder = async () => {
    setSubmittingPayment(true);

    try {
      if (selectedMethod === "COD") {
        // Cash On Delivery Direct Placement
        await completeOrderPlacement(`COD_${Date.now()}`, "Cash on Delivery");
      } else {
        // Razorpay Gateway Flow
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Please check your internet connection.");
          setSubmittingPayment(false);
          return;
        }

        // 1. Create Razorpay order from backend
        let razorpayOrderData = null;
        try {
          const res = await api.post("/order/create-razorpay-order", {
            amount: finalTotalAmount,
          });
          if (res.data?.success) {
            razorpayOrderData = res.data;
          }
        } catch (err) {
          console.warn("Backend Razorpay order creation warning:", err);
        }

        const razorpayKey =
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          razorpayOrderData?.key ||
          "rzp_test_VeloraStore2026Key";

        const razorpayOrderId = razorpayOrderData?.orderId || `order_${Date.now()}`;

        // 2. Options for Razorpay Popup Modal
        const options = {
          key: razorpayKey,
          amount: Math.round(finalTotalAmount * 100),
          currency: "INR",
          name: "Velora Store",
          description: "Payment for Order Checkout",
          image: "https://cdn-icons-png.flaticon.com/512/1170/1170576.png",
          order_id: razorpayOrderId,
          prefill: {
            name: shipping.fullname || user?.fullname || "Customer",
            email: shipping.email || user?.email || "customer@example.com",
            contact: shipping.phone || user?.phone || "9876543210",
          },
          notes: {
            address: fullShippingAddress,
          },
          theme: {
            color: "#000000",
          },
          handler: async function (response) {
            try {
              toast.info("Payment authorized! Finalizing order...");
              const payId = response.razorpay_payment_id || `RZP_${Date.now()}`;
              await completeOrderPlacement(payId, "Razorpay Online Payment");
            } catch (error) {
              toast.error(error.message || "Failed to complete order after payment.");
              setSubmittingPayment(false);
            }
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment window closed.");
              setSubmittingPayment(false);
            },
          },
        };

        const rzpWindow = new window.Razorpay(options);
        rzpWindow.on("payment.failed", function (response) {
          toast.error(response.error.description || "Payment Failed.");
          setSubmittingPayment(false);
        });
        rzpWindow.open();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to complete order.");
      setSubmittingPayment(false);
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
          You must be logged in to access the payment screen.
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50/60 to-white py-6 sm:py-10 px-3 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col gap-3 sm:gap-4 border-b border-gray-200/80 pb-4 sm:pb-6">
          <button
            onClick={() => router.push("/order")}
            className="flex items-center gap-2 self-start text-xs sm:text-sm font-semibold text-gray-700 hover:text-black bg-transparent transition cursor-pointer py-1"
          >
            <ArrowLeft size={16} />
            <span>Edit Shipping Address</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair flex items-center gap-3">
              Select Payment Method
              <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Choose Razorpay for fast, instant & secure online checkout or Pay on Delivery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT SIDE: PAYMENT OPTIONS (Cols 7) */}
          <div className="lg:col-span-7 bg-white border border-gray-200/90 p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm space-y-6">
            
            {/* Delivery Address Snapshot (Shown on top before Payment Options) */}
            {shipping.fullname && (
              <div className="bg-gray-50/80 border border-gray-200/90 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <MapPin size={15} className="text-black" />
                  Delivering To:
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">{shipping.fullname}</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {shipping.address}, {shipping.roadArea}, {shipping.city}, {shipping.stateName} - {shipping.pincode}
                </p>
                <div className="text-xs text-gray-500 font-mono flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 pt-0.5">
                  <span>Phone: {shipping.phone}</span>
                  <span className="hidden sm:inline text-gray-400">|</span>
                  <span className="break-all sm:break-normal">Email: {shipping.email}</span>
                </div>
              </div>
            )}

            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2.5">
                <CreditCard size={20} className="text-black" />
                Payment Options
              </h2>
            </div>

            <div className="space-y-3.5">
              
              {/* Option 1: Razorpay Gateway */}
              <div
                onClick={() => setSelectedMethod("RAZORPAY")}
                className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  selectedMethod === "RAZORPAY"
                    ? "border-black bg-gradient-to-r from-gray-900 to-black text-white shadow-lg scale-[1.01]"
                    : "border-gray-200 bg-white hover:border-gray-400 text-gray-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedMethod === "RAZORPAY"
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      <CreditCard size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-base font-extrabold tracking-wide">
                        Razorpay Secure Checkout
                      </h3>
                      <p
                        className={`text-[11px] sm:text-xs mt-0.5 ${
                          selectedMethod === "RAZORPAY" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking & Wallets.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === "RAZORPAY"
                          ? "border-white bg-white text-black"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "RAZORPAY" && <Check size={14} className="sm:w-4 sm:h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Cash on Delivery */}
              <div
                onClick={() => setSelectedMethod("COD")}
                className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  selectedMethod === "COD"
                    ? "border-black bg-gradient-to-r from-gray-900 to-black text-white shadow-lg scale-[1.01]"
                    : "border-gray-200 bg-white hover:border-gray-400 text-gray-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedMethod === "COD"
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      <Banknote size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-base font-extrabold tracking-wide">
                        Cash on Delivery (COD)
                      </h3>
                      <p
                        className={`text-[11px] sm:text-xs mt-0.5 ${
                          selectedMethod === "COD" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Pay with cash or UPI at your doorstep upon receiving order.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === "COD"
                          ? "border-white bg-white text-black"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "COD" && <Check size={14} className="sm:w-4 sm:h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 3: UPI / QR Code */}
              <div
                onClick={() => setSelectedMethod("UPI")}
                className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  selectedMethod === "UPI"
                    ? "border-black bg-gradient-to-r from-gray-900 to-black text-white shadow-lg scale-[1.01]"
                    : "border-gray-200 bg-white hover:border-gray-400 text-gray-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedMethod === "UPI"
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-purple-50 text-purple-600 border border-purple-100"
                      }`}
                    >
                      <QrCode size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-base font-extrabold tracking-wide">
                        UPI / Instant QR Code
                      </h3>
                      <p
                        className={`text-[11px] sm:text-xs mt-0.5 ${
                          selectedMethod === "UPI" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Google Pay, PhonePe, Paytm, BHIM & all UPI apps via Razorpay.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === "UPI"
                          ? "border-white bg-white text-black"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "UPI" && <Check size={14} className="sm:w-4 sm:h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 4: Net Banking */}
              <div
                onClick={() => setSelectedMethod("NETBANKING")}
                className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  selectedMethod === "NETBANKING"
                    ? "border-black bg-gradient-to-r from-gray-900 to-black text-white shadow-lg scale-[1.01]"
                    : "border-gray-200 bg-white hover:border-gray-400 text-gray-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedMethod === "NETBANKING"
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      <Building2 size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-base font-extrabold tracking-wide">
                        Net Banking
                      </h3>
                      <p
                        className={`text-[11px] sm:text-xs mt-0.5 ${
                          selectedMethod === "NETBANKING" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        SBI, HDFC, ICICI, Axis & 50+ major Indian banks supported.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === "NETBANKING"
                          ? "border-white bg-white text-black"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "NETBANKING" && <Check size={14} className="sm:w-4 sm:h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Complete Purchase Button */}
            <button
              onClick={handlePlaceFinalOrder}
              disabled={submittingPayment}
              className="w-full py-3.5 sm:py-4.5 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl text-xs sm:text-base flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {submittingPayment ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <ShieldCheck size={18} className="sm:w-5 sm:h-5 text-amber-400" />
                  <span>
                    {selectedMethod === "COD"
                      ? "Place Order (Cash on Delivery)"
                      : "Pay ₹" + finalTotalAmount + " with Razorpay"}
                  </span>
                </>
              )}
            </button>

          </div>

          {/* RIGHT SIDE: ORDER SUMMARY (Cols 5) */}
          <div className="lg:col-span-5 bg-white border border-gray-200/90 p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm space-y-6 lg:sticky lg:top-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-black" />
                Order Items ({items.length})
              </span>
            </h2>

            {/* Product items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {items.map((item) => {
                const prod = item.product || {};
                const imgUrl = getMediaUrl(prod.thumbnail);

                return (
                  <div
                    key={prod._id || item._id}
                    className="flex items-center gap-3.5 bg-gray-50/80 p-3 rounded-2xl border border-gray-200/70"
                  >
                    <img
                      src={imgUrl}
                      alt={prod.productName || "Product"}
                      className="w-14 h-16 object-cover rounded-xl border border-gray-200 shrink-0"
                      onError={(e) => {
                        e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="grow min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 capitalize">
                        {prod.productName}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Qty: <strong className="text-gray-900">{item.quantity}</strong>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-extrabold text-black">
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
                <span>Total Payable Amount</span>
                <span className="text-xl text-black">₹{finalTotalAmount}</span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-800">
              <Lock size={18} className="shrink-0 text-emerald-600" />
              <span>100% Purchase Protection & Free Express Delivery</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
