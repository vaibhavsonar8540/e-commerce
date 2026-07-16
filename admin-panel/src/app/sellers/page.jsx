"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, Undo2, Loader2, Calendar, UserCheck } from "lucide-react";
import api from "@/utils/axiosInstant";

export default function Seller() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/all?role=seller");
        if (response.data && response.data.users) {
          setSellers(response.data.users);
        } else {
          setSellers([]);
        }
      } catch (err) {
        console.error("Error fetching sellers:", err);
        setError(err.response?.data?.message || "Failed to load sellers data");
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  // Filter and sort sellers
  const filteredSellers = sellers
    .filter((seller) => {
      // 1. Search Query Filter
      const matchSearch =
        seller.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.phone?.includes(searchQuery);

      // 2. Date Filter
      let matchDate = true;
      if (filterDate && seller.createdAt) {
        const sellerDate = new Date(seller.createdAt).toISOString().split("T")[0];
        matchDate = sellerDate === filterDate;
      }

      return matchSearch && matchDate;
    })
    .sort((a, b) => {
      const nameA = a.fullname?.toLowerCase() || "";
      const nameB = b.fullname?.toLowerCase() || "";
      if (sortOrder === "ASC") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md border border-gray-200 transition-all animate-fade-in"
        >
          <Undo2 size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase text-gray-800 tracking-tight">Sellers</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage merchant and vendor accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-stretch md:items-center mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search sellers by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50 focus:bg-white"
          />
        </div>

        {/* Date and Sort Selectors */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white min-w-[150px]"
          />

          <div className="relative min-w-[130px]">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full appearance-none border border-gray-300 rounded-lg px-4 pr-10 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer text-gray-700 font-medium"
            >
              <option value="ASC">Sort: A-Z</option>
              <option value="DESC">Sort: Z-A</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Main List Area: Responsive dual view */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
          <p className="text-gray-500 font-medium">Fetching registered sellers...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4 font-bold text-lg">
            !
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Failed to get sellers</h3>
          <p className="text-gray-500 max-w-md text-sm">{error}</p>
        </div>
      ) : filteredSellers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
            <UserCheck size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg mb-1">No sellers found</h3>
          <p className="text-gray-500 max-w-sm text-sm">
            {searchQuery || filterDate
              ? "Try adjusting filters or search phrase to find specific vendors."
              : "There are currently no merchants registered with seller role."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Grid Layout (visible on smaller viewports) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredSellers.map((seller, index) => (
              <div
                key={seller._id || seller.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-wider">
                      {seller.role}
                    </span>
                  </div>
                  {seller.createdAt && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 hover:text-gray-500 transition-colors">
                      <Calendar size={10} />
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Full Name</span>
                    <span className="text-sm font-semibold text-gray-800 block">{seller.fullname}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Email Address</span>
                    <span className="text-sm text-gray-600 block break-all">{seller.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Phone</span>
                    <span className="text-sm text-gray-600 block">{seller.phone || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout (visible on medium & large viewports) */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 w-16 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSellers.map((seller, index) => (
                    <tr
                      key={seller._id || seller.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 text-center text-sm font-medium text-gray-500">{index + 1}</td>
                      <td className="p-4 text-sm font-semibold text-gray-800">{seller.fullname}</td>
                      <td className="p-4 text-sm text-gray-600">{seller.email}</td>
                      <td className="p-4 text-sm text-gray-600 font-mono">{seller.phone}</td>
                      <td className="p-4 text-sm">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-wider">
                          {seller.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 font-mono">
                        {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 text-xs sm:text-sm text-gray-500 text-right font-medium">
            Showing {filteredSellers.length} of {sellers.length} sellers
          </div>
        </>
      )}
    </div>
  );
}