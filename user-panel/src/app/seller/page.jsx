"use client";

import React from "react";
import HeroBanner from "@/components/heroBanner";
import sellerBnr from "@/assets/seller.webp";
import { CheckCircle2, ChevronRight, Award, DollarSign, Ban, BookOpen } from "lucide-react";
import Link from "next/link";

const SellerPage = () => {
  return (
    <div className="bg-white min-h-screen text-gray-800">
      
      {/* Hero Banner Component: custom-suited for seller onboarding */}
      <div className="relative h-120 overflow-hidden bg-linear-to-r from-purple-800 to-indigo-900 flex items-center col-span-1">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-playfair leading-tight animate-fade-in">
              Grow Your Business with Veloza
            </h1>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
              Sell to lakhs of customers across India with 0% Commission and 0 penalty charges. Start your digital store in minutes!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/seller/register"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#FF6B35] hover:bg-[#e05624] text-white font-extrabold rounded-xl transition shadow-lg text-sm text-center cursor-pointer"
              >
                <span>Become a Seller</span>
                <ChevronRight size={16} className="ml-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition text-sm text-center cursor-pointer"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-end pr-5">
            <div className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 p-2">
              <img
                src={sellerBnr.src || "/assets/seller.webp"}
                alt="Seller Portal Logo"
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400";
                }}
              />
            </div>
          </div>
        </div>
        {/* Background Decorative Accent */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
      </div>

      {/* Grid statistics section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm divide-y md:divide-y-0 md:divide-x divide-gray-150">
          <div className="p-4 text-center">
            <h3 className="text-3xl font-extrabold text-[#FF6B35]">Lakhs+</h3>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wide">Trusted Suppliers</p>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-3xl font-extrabold text-[#FF6B35]">Crores+</h3>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wide">Registered Buyers</p>
          </div>
          <div className="p-4 text-center pt-8 md:pt-4">
            <h3 className="text-3xl font-extrabold text-[#FF6B35]">28,000+</h3>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wide">Serviceable Pincodes</p>
          </div>
          <div className="p-4 text-center pt-8 md:pt-4">
            <h3 className="text-3xl font-extrabold text-[#FF6B35]">700+</h3>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wide">Product Categories</p>
          </div>
        </div>
      </div>

      {/* Why Suppliers Love Veloza Section */}
      <div className="bg-gray-50/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair leading-tight">
              Why Suppliers Love Selling on Veloza
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-semibold">
              Veloza is the fastest-growing online store hub in the country. Our seller-friendly ecosystem guarantees maximal earnings.
            </p>
            <div className="pt-2">
              <Link href="/seller/register" className="inline-flex items-center text-xs font-extrabold text-[#FF6B35] hover:text-[#e05624] tracking-wide uppercase transition cursor-pointer">
                <span>Start Earning Now</span>
                <ChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                <DollarSign size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">0% Commission Fee</h3>
              <p className="text-xs text-gray-550 leading-relaxed">
                Suppliers keep 100% of their profits. We do not deduct any commission fee on order sales.
              </p>
            </div>

            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                <Ban size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">0 Penalty Charges</h3>
              <p className="text-xs text-gray-555 leading-relaxed">
                Sell online without any order cancellation charges. No penalties for late dispatches or user return orders.
              </p>
            </div>

            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                <Award size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Growth for Everyone</h3>
              <p className="text-xs text-gray-555 leading-relaxed">
                From small shops to major brands, Veloza promotes everyone. Sell with regular or composition GSTIN.
              </p>
            </div>

            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                <BookOpen size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Ease of Doing Business</h3>
              <p className="text-xs text-gray-555 leading-relaxed">
                Simple product listing panel, cheap custom delivery networks, and swift 7-day payments direct to bank.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div id="how-it-works" className="max-w-7xl mx-auto py-16 px-4 sm:px-8 lg:px-12 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair">
            How to Sell on Veloza
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Follow our simple onboarding pipeline and start processing your customer orders in five steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm relative text-center">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black font-extrabold text-white text-xs flex items-center justify-center">1</span>
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest mt-4">Create Account</h3>
            <p className="text-xs text-gray-400 mt-2">Sign-up and input your verified contact details and store information.</p>
          </div>

          <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm relative text-center">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black font-extrabold text-white text-xs flex items-center justify-center">2</span>
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest mt-4">List Products</h3>
            <p className="text-xs text-gray-400 mt-2">Upload your inventory selection via the easy-to-use admin vendor panel.</p>
          </div>

          <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm relative text-center">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black font-extrabold text-white text-xs flex items-center justify-center">3</span>
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest mt-4">Get Orders</h3>
            <p className="text-xs text-gray-400 mt-2">Millions of buyers view your products and checkout items online.</p>
          </div>

          <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm relative text-center">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black font-extrabold text-white text-xs flex items-center justify-center">4</span>
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest mt-4">Ship Orders</h3>
            <p className="text-xs text-gray-400 mt-2">Print label, wrap packages, and let our logistics partners handle delivery.</p>
          </div>

          <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm relative text-center">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black font-extrabold text-white text-xs flex items-center justify-center">5</span>
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest mt-4">Cash Out</h3>
            <p className="text-xs text-gray-400 mt-2">Funds are safely processed and wired to your bank within 7 days.</p>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/seller/register"
            className="inline-flex items-center justify-center px-10 py-4 bg-black hover:bg-gray-900 text-white font-extrabold rounded-2xl transition shadow-lg text-sm text-center cursor-pointer"
          >
            Start Onboarding
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
