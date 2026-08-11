"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Undo2,
  Ticket,
  PlusCircle,
  List,
  Search,
  Trash2,
  Tag,
  Percent,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import api from "@/utils/axiosInstant";
import { toast } from "react-toastify";

export default function CouponCodePage() {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "create"
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    discountType: "percentage",
    minOrderAmount: "0",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch Coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/coupon/all");
      if (res.data?.success) {
        setCoupons(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
      toast.error(err?.response?.data?.message || "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Toggle Coupon Status (Active / Inactive)
  const handleToggleCouponStatus = async (id, code) => {
    setTogglingId(id);
    try {
      const res = await api.patch(`/coupon/toggle-status/${id}`);
      if (res.data?.success) {
        const updated = res.data.data;
        setCoupons((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isActive: updated.isActive } : c))
        );
        toast.success(res.data.message || `Coupon '${code}' is now ${updated.isActive ? "Active" : "Inactive"}.`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  // Handle Create Coupon Submit
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    if (!formData.discount || Number(formData.discount) <= 0) {
      toast.error("Please enter a valid discount number greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/coupon/create", {
        code: formData.code.trim().toUpperCase(),
        discount: Number(formData.discount),
        discountType: formData.discountType,
        minOrderAmount: Number(formData.minOrderAmount) || 0,
      });

      if (res.data?.success) {
        toast.success("Coupon code created successfully!");
        setFormData({
          code: "",
          discount: "",
          discountType: "percentage",
          minOrderAmount: "0",
        });
        await fetchCoupons();
        setActiveTab("all"); // Switch back to view created coupons
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create coupon code."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon '${code}'?`)) return;

    try {
      const res = await api.delete(`/coupon/${id}`);
      if (res.data?.success) {
        toast.success(`Coupon '${code}' deleted.`);
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete coupon.");
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/dashboard"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 transition shrink-0"
          >
            <Undo2 size={18} className="sm:w-5 sm:h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-gray-900 flex items-center gap-2">
              <Ticket className="text-black shrink-0" size={24} />
              Coupon Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Create and manage promo codes & promotional discounts.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation Layout */}
      <div className="bg-white rounded-2xl p-1.5 sm:p-2 shadow-sm border border-gray-200 mb-6 flex flex-row gap-1.5 sm:gap-2 max-w-md w-full">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === "all"
              ? "bg-black text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <List size={16} />
          <span>Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === "create"
              ? "bg-black text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <PlusCircle size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* TAB 1: CREATED COUPONS LIST */}
      {activeTab === "all" && (
        <div className="space-y-4 sm:space-y-6">
          {/* Search Filter */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 flex gap-4 items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coupon code..."
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 outline-none focus:border-black text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 sm:p-12 text-center text-gray-500 font-medium text-sm">
                Loading coupons...
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Tag size={26} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">No Coupons Found</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {searchQuery
                    ? `No coupon matching "${searchQuery}"`
                    : "No coupons created yet. Click 'Create Coupon' tab to add one!"}
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-4 py-2.5 bg-black text-white font-semibold rounded-xl text-xs sm:text-sm hover:bg-gray-800 transition cursor-pointer"
                >
                  Create Your First Coupon
                </button>
              </div>
            ) : (
              <>
                {/* Mobile Cards Layout (< md) */}
                <div className="block md:hidden divide-y divide-gray-100">
                  {filteredCoupons.map((coupon, index) => (
                    <div key={coupon._id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-emerald-50 text-emerald-700 font-mono font-bold uppercase text-sm px-3 py-1 rounded-lg border border-emerald-200 tracking-wider">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Coupon"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <span className="text-gray-400 block font-semibold">Discount</span>
                          <span className="font-extrabold text-black text-sm">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discount}% OFF`
                              : `₹${coupon.discount} OFF`}
                          </span>
                        </div>

                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <span className="text-gray-400 block font-semibold">Min Order</span>
                          <span className="font-bold text-gray-800 text-sm">
                            ₹{coupon.minOrderAmount}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-gray-400 font-medium capitalize">
                          Type: <strong className="text-gray-700">{coupon.discountType}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleCouponStatus(coupon._id, coupon.code)}
                          disabled={togglingId === coupon._id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer shadow-xs active:scale-95 border ${
                            coupon.isActive !== false
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                              : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                          }`}
                          title="Click to toggle status"
                        >
                          {coupon.isActive !== false ? (
                            <>
                              <CheckCircle2 size={12} className="text-emerald-700" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={12} className="text-red-700" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (>= md) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-xs uppercase text-gray-600 font-semibold border-b border-gray-200">
                        <th className="p-4 w-12">#</th>
                        <th className="p-4">Coupon Code</th>
                        <th className="p-4">Discount</th>
                        <th className="p-4">Discount Type</th>
                        <th className="p-4">Min Order</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {filteredCoupons.map((coupon, index) => (
                        <tr key={coupon._id} className="hover:bg-gray-50/80 transition">
                          <td className="p-4 text-gray-500 font-medium">{index + 1}</td>
                          <td className="p-4 font-bold text-gray-900 tracking-wider font-mono uppercase">
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="p-4 font-extrabold text-black">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discount}% OFF`
                              : `₹${coupon.discount} OFF`}
                          </td>
                          <td className="p-4 capitalize text-gray-600 font-medium">
                            {coupon.discountType}
                          </td>
                          <td className="p-4 text-gray-700 font-semibold">
                            ₹{coupon.minOrderAmount}
                          </td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => handleToggleCouponStatus(coupon._id, coupon.code)}
                              disabled={togglingId === coupon._id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer shadow-xs active:scale-95 border ${
                                coupon.isActive !== false
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                                  : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                              }`}
                              title="Click to toggle status"
                            >
                              {coupon.isActive !== false ? (
                                <>
                                  <CheckCircle2 size={13} className="text-emerald-700" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <XCircle size={13} className="text-red-700" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete Coupon"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CREATE COUPON FORM */}
      {activeTab === "create" && (
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200 shadow-sm space-y-5 sm:space-y-6">
          <div className="border-b border-gray-100 pb-3.5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500 shrink-0" />
              Create New Promo Coupon Code
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Enter coupon code and numerical discount details below.
            </p>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4 sm:space-y-5">
            {/* Coupon Code Input */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                Coupon Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME10, SAVE20"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 outline-none focus:border-black font-mono font-bold uppercase tracking-wider text-xs sm:text-sm"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Coupon codes will automatically convert to uppercase letters.
              </p>
            </div>

            {/* Discount Number & Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                  Discount Value (Number) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {formData.discountType === "percentage" ? (
                    <Percent
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  ) : (
                    <IndianRupee
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  )}
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="e.g. 10 or 150"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 outline-none focus:border-black font-semibold text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({ ...formData, discountType: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 sm:py-3 outline-none focus:border-black font-semibold text-xs sm:text-sm bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>

            {/* Minimum Order Amount */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                Minimum Order Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0 for no minimum"
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderAmount: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 sm:py-3 outline-none focus:border-black font-semibold text-xs sm:text-sm"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Minimum cart subtotal required to apply this coupon code.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 bg-black hover:bg-gray-900 text-white py-3 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Saving Coupon...</span>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span>Create Coupon Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="w-full sm:w-auto px-5 py-3 sm:py-3.5 border border-gray-300 hover:bg-gray-100 rounded-xl font-semibold text-xs sm:text-sm transition text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
