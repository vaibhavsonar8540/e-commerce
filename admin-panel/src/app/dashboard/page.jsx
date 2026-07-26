"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Store,
  Layers3,
  Grid2X2,
  ListTree
} from "lucide-react";
import api from "@/utils/axiosInstant";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    contacts: 0,
    sellers: 0,
    collections: 0,
    categories: 0,
    subcategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/user/dashboard-stats");
        if (data && data.success && data.counts) {
          setCounts(data.counts);
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setError(err.response?.data?.message || "Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Contact Requests",
      count: counts.contacts || 0,
      href: "/contact-requests",
      icon: MessageSquare,
      bg: "bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border border-indigo-200/50 shadow-sm hover:shadow-md",
      iconBg: "bg-indigo-600 text-white shadow-lg shadow-indigo-200",
      text: "text-indigo-700",
    },
    {
      title: "Sellers",
      count: counts.sellers,
      href: "/sellers",
      icon: Store,
      bg: "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200/50 shadow-sm hover:shadow-md",
      iconBg: "bg-blue-600 text-white shadow-lg shadow-blue-200",
      text: "text-blue-700",
    },
    {
      title: "Collections",
      count: counts.collections,
      href: "/Navigations/collection",
      icon: Layers3,
      bg: "bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border border-amber-200/50 shadow-sm hover:shadow-md",
      iconBg: "bg-amber-600 text-white shadow-lg shadow-amber-200",
      text: "text-amber-700",
    },
    {
      title: "Categories",
      count: counts.categories,
      href: "/Navigations/category",
      icon: Grid2X2,
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200/50 shadow-sm hover:shadow-md",
      iconBg: "bg-emerald-600 text-white shadow-lg shadow-emerald-200",
      text: "text-emerald-700",
    },
    {
      title: "Sub Categories",
      count: counts.subcategories,
      href: "/Navigations/sub-category",
      icon: ListTree,
      bg: "bg-gradient-to-br from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 border border-rose-200/50 shadow-sm hover:shadow-md",
      iconBg: "bg-rose-600 text-white shadow-lg shadow-rose-200",
      text: "text-rose-700",
    },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
          Hi, Welcome back 👋
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Here is a quick snapshot of your e-commerce operations dashboard.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-56 animate-pulse flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                <div className="w-8 h-6 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-250 rounded-md"></div>
                <div className="w-12 h-8 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl border border-red-200 p-8 flex flex-col items-center justify-center text-center shadow-sm max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4 font-bold text-lg">!</div>
          <h3 className="font-semibold text-gray-800 mb-1">Failed to load dashboard metrics</h3>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.title} href={item.href} className="group">
                <div
                  className={`${item.bg} rounded-3xl p-6 shadow-sm cursor-pointer h-56 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`${item.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center`}
                    >
                      <Icon size={26} />
                    </div>

                    <span className={`text-xl sm:text-2xl font-bold tracking-tight ${item.text}`}>
                      {item.count}
                    </span>
                  </div>

                  <div>
                    <p className="text-[12px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {item.title}
                    </p>

                    <h2 className={`text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight ${item.text}`}>
                      {item.count}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}