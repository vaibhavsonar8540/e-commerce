"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Home, MapPin, PackageCheck } from "lucide-react";

export default function CheckoutSuccessPage() {
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("lastOrder");
      if (saved) {
        try {
          setOrderInfo(JSON.parse(saved));
        } catch (e) {
          // catch error silently
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 text-center space-y-5 sm:space-y-6 mx-2">
        
        {/* Success Animated Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
          <CheckCircle2 size={36} className="sm:w-11 sm:h-11" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-playfair">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
            Thank you for shopping with us. Your order has been confirmed and is being processed.
          </p>
        </div>

        {/* Summary Card */}
        {orderInfo && (
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 text-left space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Order Ref ID</span>
              <span className="font-mono font-bold text-gray-900 text-xs">
                #{orderInfo.order?._id || "CONFIRMED"}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-600">
              <span className="flex items-center gap-1 font-semibold">
                <MapPin size={14} /> Recipient:
              </span>
              <span className="font-bold text-gray-800 truncate ml-2">
                {orderInfo.shipping?.fullname}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>City / State:</span>
              <span className="font-semibold text-gray-800">
                {orderInfo.shipping?.city}, {orderInfo.shipping?.stateName}
              </span>
            </div>

            {orderInfo.discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold">
                <span>Coupon Discount:</span>
                <span>-₹{orderInfo.discountAmount} OFF</span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-gray-200/80 pt-2 font-bold text-gray-900 text-sm sm:text-base">
              <span>Amount Paid:</span>
              <span className="text-emerald-700">₹{orderInfo.totalAmount || orderInfo.subTotal}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/profile"
            className="w-full sm:flex-1 py-3 sm:py-3.5 bg-black hover:bg-gray-900 text-white font-bold rounded-xl sm:rounded-2xl transition text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <PackageCheck size={18} />
            <span>View Order History</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:flex-1 py-3 sm:py-3.5 border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold rounded-xl sm:rounded-2xl transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
