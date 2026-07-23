"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import { ArrowLeft, Package, Sparkles, RefreshCw, AlertCircle, Plus, Eye } from "lucide-react";
import Link from "next/link";
import api from "@/utils/axiosInstant";
import { toast } from "react-toastify";
import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";

export default function MyProductsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMyProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/product/my-products");
      if (response.data?.success) {
        setProducts(response.data.products || []);
      } else {
        setError("Could not retrieve your products directory.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Server Error: Unable to fetch products.");
      toast.error(err?.response?.data?.message || "Failed to load products list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (user?.role === "seller" || user?.role === "admin") {
        fetchMyProducts();
      }
    }
  }, [authLoading, isAuthenticated, user]);

  // Auth & Role Guard
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/30">
        <span className="w-10 h-10 border-4 border-[#45220e]/20 border-t-[#45220e] rounded-full animate-spin"></span>
        <p className="text-sm font-semibold text-gray-500 mt-3">Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/30 p-4">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-8 max-w-md w-full text-center shadow-sm space-y-6">
          <div className="w-16 h-16 bg-[#f9ece5] text-[#45220e] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Package size={28} />
          </div>
          <h2 className="text-2xl font-bold font-playfair text-[#45220e]">Access Vendor Portal</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Please login as an Admin or Seller to view, manage, and track your active product listings.
          </p>
          <div>
            <button
              onClick={() => dispatch(setIsModelOpen(true))}
              className="w-full py-3 bg-[#45220e] hover:bg-[#34180a] text-white font-bold rounded-2xl transition duration-200 outline-none text-sm cursor-pointer shadow-md hover:shadow-lg"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "seller" && user?.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/30 p-4">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-8 max-w-md w-full text-center shadow-sm space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-2xl font-bold font-playfair text-red-800">Unauthorised Access</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Only accounts registered as <strong>Sellers</strong> or <strong>Admins</strong> are authorised to list products and access this catalog.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex w-full justify-center py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl transition duration-200 text-sm shadow-md"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter products by search term
  const filteredProducts = products.filter((prod) =>
    prod.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/30 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
        
        {/* Top bar / Action items */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-[#45220e] font-playfair tracking-tight">Your Products</h1>
            <p className="text-xs sm:text-sm text-gray-400">Manage and look up inventories offered under your account profile.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchMyProducts}
              className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:text-black hover:shadow-sm transition cursor-pointer"
              title="Refresh Catalog"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              href="/add-product"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#45220e] hover:bg-[#34180a] text-white font-semibold text-sm rounded-xl cursor-pointer shadow-md hover:shadow-lg transition flex-1 sm:flex-none"
            >
              <Plus size={16} />
              <span>Create Product</span>
            </Link>
          </div>
        </div>

        {/* Search Bar / Filter tools */}
        <div className="bg-[#F8F8F8] border border-gray-200 rounded-2xl p-4">
          <input
            type="text"
            placeholder="Search products by title or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 px-4 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition text-gray-700 placeholder:text-gray-400 bg-white text-sm"
          />
        </div>

        {/* Products Table Card */}
        {loading ? (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <span className="w-10 h-10 border-4 border-[#45220e]/20 border-t-[#45220e] rounded-full animate-spin"></span>
              <p className="text-sm font-semibold text-gray-500">Loading catalog items...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 border border-red-200/50 p-6 rounded-3xl text-center font-medium shadow-sm">
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 bg-[#f9ece5] text-[#45220e] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Package size={28} />
            </div>
            <div className="space-y-2 mt-4">
              <h3 className="text-xl font-bold text-gray-800">No Catalog Entries Found</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
                {searchTerm 
                  ? "No products matched your search parameters. Try altering your keywords." 
                  : "You haven't listed any products yet. Get started by creating your very first catalog entry!"}
              </p>
            </div>
            {!searchTerm && (
              <div className="pt-2">
                <Link
                  href="/add-product"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white font-semibold text-sm rounded-xl transition shadow"
                >
                  <Plus size={16} />
                  <span>List First Product</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200/80 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-gray-400">Product Info</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-gray-400">Brand</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-gray-400">Price Structure</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-gray-400 text-center">Stock</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-gray-400 text-center">Status</th>
                    <th className="py-3 px-6 text-[10px] font-black uppercase tracking-wider text-gray-400 text-center">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const priceText = `₹${p.price.toLocaleString()}`;
                    const discountText = p.discountPrice ? `₹${p.discountPrice.toLocaleString()}` : null;
                    const isOutOfStock = p.stock === 0;
                    const isLowStock = !isOutOfStock && p.stock < 5;

                    return (
                      <tr key={p._id} className="hover:bg-gray-50/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            {p.thumbnail || p.images?.[0] ? (
                              <img
                                src={getMediaUrl(p.thumbnail || p.images?.[0])}
                                alt={p.productName}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                                onError={(e) => {
                                  e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                <Package size={18} />
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{p.productName}</h4>
                              <p className="text-[10px] text-gray-400 font-medium">Added {new Date(p.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-650 font-medium">{p.brand || "—"}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            {discountText ? (
                              <>
                                <span className="text-sm font-bold text-gray-905">{discountText}</span>
                                <span className="text-[10px] text-gray-400 line-through font-medium">{priceText}</span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-gray-905">{priceText}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                            isOutOfStock 
                              ? "bg-red-50 text-red-700" 
                              : isLowStock 
                              ? "bg-amber-50 text-amber-700" 
                              : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : p.status === "draft"
                              ? "bg-gray-100 text-gray-600 border border-gray-200"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Link
                            href={`/product/${p._id}`}
                            className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition cursor-pointer"
                            title="View Catalog Details"
                          >
                            <Eye size={16} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
