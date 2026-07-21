"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, Truck, DollarSign, HelpCircle, ArrowLeft } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
        
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#45220e] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="border-b border-gray-200 pb-6 text-center sm:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#45220e] tracking-tight font-playfair capitalize">
            Return & Cancellation Policy
          </h1>
          <p className="text-sm text-gray-400">
            Last Updated: July 19, 2026. Simple, seamless refund rules and exchange instructions.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 text-gray-600 text-sm leading-relaxed">
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <RotateCcw size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">1. 7 Days Returns Window</h3>
              <p>
                Items purchased on Velora are eligible for a return or exchange within 7 days from delivery. Products must remain in original unused condition, with barcode tags and premium packaging completely intact.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <Truck size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">2. Free Return Logistics Pickup</h3>
              <p>
                Once your return is submitted and approved from your Buyer Dashboard, we schedule a free pickup service to retrieve the package from your address. Ensure coordinates are correctly saved.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <DollarSign size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">3. Rapid Money Refunds</h3>
              <p>
                Following return quality inspections at our hub (takes 2-3 workdays), your billing refund will be automatically dispatched to your original transaction gateway account or bank.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <HelpCircle size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">4. Need Help? Contact Us</h3>
              <p>
                For specific custom shipping queries or damaged items reporting, please navigate to our <Link href="/contact-us" className="text-[#45220e] underline font-bold">Contact Page</Link> and file a query entry. Our support agents respond in under 24 hours.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
