"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">
            Last Updated: July 19, 2026. Review how Velora curates and protects your personal credentials.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 text-gray-600 text-sm leading-relaxed">
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <Shield size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">1. Information We Collect</h3>
              <p>
                We collect personal registration details including your full name, email address, shipping destination, telephone number, and verification billing records when you place a checkout command on our server.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <Eye size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">2. How We Use Collected Details</h3>
              <p>
                Your collected credentials are used specifically to fulfill orders, process secure transaction payments, optimize shipping logistics, offer responsive buyer support, and distribute promotional collections. We do not sell or trade your details.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <Lock size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">3. Secure Database Protection</h3>
              <p>
                All data transmission pathways utilize 100% verified SSL certificates and tokenized encryptions. Confidential user credentials (such as password parameters) are stored in hashed formats to prevent unauthorized security violations.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0 shadow-inner">
              <FileText size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">4. Third-Party Sharing Rules</h3>
              <p>
                We only dispatch information to trusted logistics contractors and verified monetary gateways to process order checkouts. These partners are legally bound to protect database parameters and operate in compliance with digital laws.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
