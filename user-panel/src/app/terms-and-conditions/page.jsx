"use client";

import React from "react";
import Link from "next/link";
import { Scale, CheckCircle2, UserCheck, AlertTriangle, ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
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
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-400">
            Last Updated: July 19, 2026. Review user agreements, acceptable use, and transaction guidelines when visiting Velora.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 text-gray-600 text-sm leading-relaxed">
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <Scale size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">1. Acceptance of Terms</h3>
              <p>
                By opening, browsing, or placing order commands on the Velora e-commerce web platform, users explicitly declare agreement to comply with our Terms, guidelines, rules, and privacy regulations.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <UserCheck size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">2. Account Credentials</h3>
              <p>
                When creating account profiles (User, Seller, or Admin), you agree to provide authentic and unique details (fullname, email, and 10-digit Indian phone number). You are solely responsible for protecting password access parameters.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <CheckCircle2 size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">3. Purchase Transactions</h3>
              <p>
                Prices listed on the catalog are final at the checkout step. Velora reserves the right to cancel orders arising from catalog representation errors or unavailable stocks. Refunds will be generated back via transaction pathways.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">4. Limitations of Liability</h3>
              <p>
                Velora provides this platform on an "as is" and "as available" basis without express guarantees. We are not liable for delayed logistics, technical server outages, or incorrect third-party vendor offerings.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
