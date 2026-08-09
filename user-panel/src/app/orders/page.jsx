"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import Link from "next/link";
import api from "@/utils/axiosInstant";
import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";
import { toast } from "react-toastify";
import {
  Package,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Store,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Eye,
  X,
  ShieldCheck,
  Tag,
  Pencil,
} from "lucide-react";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const isSeller = user?.role === "seller" || user?.role === "admin";
  const [activeTab, setActiveTab] = useState(isSeller ? "seller" : "buyer");

  const [sellerOrders, setSellerOrders] = useState([]);
  const [buyerOrders, setBuyerOrders] = useState([]);

  const [loadingSeller, setLoadingSeller] = useState(false);
  const [loadingBuyer, setLoadingBuyer] = useState(false);

  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("Processing");

  // Handle Order Status Update (Seller)
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatusId(orderId);
    try {
      const res = await api.put("/order/update-status", {
        orderId,
        orderStatus: newStatus,
      });
      if (res.data?.success) {
        toast.success(`Order status updated to ${newStatus}`);

        // Update seller orders in state
        setSellerOrders((prev) =>
          prev.map((ord) =>
            ord._id === orderId
              ? {
                  ...ord,
                  orderStatus: newStatus,
                  paymentStatus:
                    newStatus === "Delivered" ? "Paid" : ord.paymentStatus,
                }
              : ord
          )
        );

        // Update buyer orders in state
        setBuyerOrders((prev) =>
          prev.map((ord) =>
            ord._id === orderId
              ? {
                  ...ord,
                  orderStatus: newStatus,
                  paymentStatus:
                    newStatus === "Delivered" ? "Paid" : ord.paymentStatus,
                }
              : ord
          )
        );

        // Update active modal if open
        if (selectedOrderModal && selectedOrderModal._id === orderId) {
          setSelectedOrderModal((prev) => ({
            ...prev,
            orderStatus: newStatus,
            paymentStatus:
              newStatus === "Delivered" ? "Paid" : prev.paymentStatus,
          }));
        }
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error(
        err.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Fetch Seller Received Orders
  const fetchSellerOrders = async () => {
    setLoadingSeller(true);
    try {
      const res = await api.get("/order/seller-orders");
      if (res.data?.success) {
        setSellerOrders(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching seller orders:", err);
    } finally {
      setLoadingSeller(false);
    }
  };

  // Fetch Buyer Purchase Orders
  const fetchBuyerOrders = async () => {
    setLoadingBuyer(true);
    try {
      const res = await api.get("/order/history");
      if (res.data?.success) {
        setBuyerOrders(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching buyer orders:", err);
    } finally {
      setLoadingBuyer(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBuyerOrders();
      if (isSeller) {
        fetchSellerOrders();
      }
    }
  }, [isAuthenticated, isSeller]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
        <div className="w-20 h-20 bg-gray-100/80 rounded-3xl flex items-center justify-center text-gray-500 mb-5 shadow-inner">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-playfair">
          Sign In Required
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Please log in to your account to view your orders and purchase history.
        </p>
        <button
          onClick={() => dispatch(setIsModelOpen(true))}
          className="mt-6 px-7 py-3.5 bg-black hover:bg-gray-900 text-white font-bold rounded-2xl transition duration-200 text-sm shadow-lg hover:shadow-xl cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const currentOrders = activeTab === "seller" ? sellerOrders : buyerOrders;
  const isLoading = activeTab === "seller" ? loadingSeller : loadingBuyer;

  return (
    <div className="min-h-screen bg-gray-50/40 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair">
              Your Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isSeller
                ? "Manage customer orders received for your store or view your personal purchases."
                : "View all your past purchases and track order delivery status."}
            </p>
          </div>

          <button
            onClick={activeTab === "seller" ? fetchSellerOrders : fetchBuyerOrders}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer shadow-xs"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* Tab Toggle for Sellers */}
        {isSeller && (
          <div className="flex bg-gray-200/70 p-1.5 rounded-2xl w-full sm:w-max gap-1">
            <button
              onClick={() => setActiveTab("seller")}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === "seller"
                  ? "bg-[#45220e] text-white shadow-md"
                  : "text-gray-600 hover:text-black hover:bg-white/50"
              }`}
            >
              <Store size={16} />
              <span>Customer Orders Received ({sellerOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("buyer")}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === "buyer"
                  ? "bg-[#45220e] text-white shadow-md"
                  : "text-gray-600 hover:text-black hover:bg-white/50"
              }`}
            >
              <ShoppingBag size={16} />
              <span>My Purchases ({buyerOrders.length})</span>
            </button>
          </div>
        )}

        {/* Orders Content Grid */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-20 bg-gray-100 rounded-2xl w-full"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
              </div>
            ))}
          </div>
        ) : currentOrders.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm space-y-5">
            <div className="w-20 h-20 bg-gray-100/80 rounded-3xl flex items-center justify-center mx-auto text-gray-400 mb-4 shadow-inner">
              <Package size={36} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 font-playfair">
              No Orders Found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              {activeTab === "seller"
                ? "You haven't received any customer orders for your products yet."
                : "You haven't placed any orders yet."}
            </p>
            <div className="pt-2">
              <Link
                href={activeTab === "seller" ? "/add-product" : "/"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-900 text-white font-extrabold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md"
              >
                <span>{activeTab === "seller" ? "+ Add Products" : "Explore Store"}</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {currentOrders.map((ord) => {
              const orderId = ord._id || "N/A";
              const formattedDate = ord.createdAt
                ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recently";

              const isSellerView = activeTab === "seller";
              const buyerInfo = ord.userId || {};
              const ship = ord.shippingAddress || {};

              // Status styles
              const statusColors = {
                Processing: "bg-amber-50 text-amber-800 border-amber-200",
                Shipped: "bg-blue-50 text-blue-800 border-blue-200",
                Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
                Cancelled: "bg-red-50 text-red-800 border-red-200",
              };

              const currentStatus = ord.orderStatus || "Processing";
              const badgeStyle =
                statusColors[currentStatus] || statusColors["Processing"];

              return (
                <div
                  key={orderId}
                  className="bg-white border border-gray-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Card Header Bar */}
                  <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="p-2 bg-white rounded-xl border border-gray-200/80 text-gray-700 shadow-xs">
                        <Package size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Order ID
                          </span>
                          <span className="text-xs font-mono font-extrabold text-gray-900">
                            #{orderId.substring(orderId.length - 8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mt-0.5">
                          <Calendar size={12} />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${badgeStyle} flex items-center gap-1.5`}
                        >
                          {currentStatus === "Delivered" ? (
                            <CheckCircle2 size={13} />
                          ) : currentStatus === "Cancelled" ? (
                            <XCircle size={13} />
                          ) : currentStatus === "Shipped" ? (
                            <Truck size={13} />
                          ) : (
                            <Clock size={13} />
                          )}
                          <span>{currentStatus}</span>
                        </span>

                        {isSellerView && (
                          <button
                            type="button"
                            onClick={() => {
                              setStatusModalOrder(ord);
                              setPendingStatus(ord.orderStatus || "Processing");
                            }}
                            className="p-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-full transition cursor-pointer text-gray-600 shadow-xs border border-gray-200"
                            title="Edit Order Status"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ord.paymentStatus || "Paid"}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedOrderModal(ord)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-full transition cursor-pointer shadow-xs shrink-0"
                        title="View Full Order Information"
                      >
                        <Eye size={13} />
                        <span>View Info</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content Grid */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Products List (Left Col 7) */}
                    <div className="lg:col-span-7 space-y-3">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                        Purchased Items ({ord.items?.length || 0})
                      </h4>
                      <div className="space-y-3">
                        {ord.items?.map((item, idx) => {
                          const prod = item.productid || {};
                          const imgUrl = getMediaUrl(
                            prod.thumbnail || item.thumbnail
                          );
                          const title =
                            item.productName || prod.productName || "Product";
                          const price = item.price || prod.price || 0;
                          const qty = item.quantity || 1;

                          return (
                            <div
                              key={item._id || idx}
                              className="flex items-center gap-4 bg-gray-50/60 p-3 rounded-2xl border border-gray-100"
                            >
                              <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                                <img
                                  src={imgUrl}
                                  alt={title}
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                                  }}
                                />
                              </div>
                              <div className="grow min-w-0">
                                <h5 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug truncate capitalize">
                                  {title}
                                </h5>
                                <p className="text-xs text-gray-500 font-medium mt-1">
                                  ₹{price} × {qty}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs sm:text-sm font-extrabold text-gray-900 block">
                                  ₹{price * qty}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer & Shipping Details (Right Col 5) */}
                    <div className="lg:col-span-5 bg-gray-50/70 rounded-2xl p-4 sm:p-5 border border-gray-200/80 space-y-4">
                      {isSellerView ? (
                        <>
                          <div>
                            <h4 className="text-xs font-extrabold text-[#45220e] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                              <User size={14} />
                              Customer Information
                            </h4>
                            <div className="space-y-1 text-xs text-gray-700">
                              <p className="font-extrabold text-gray-900">
                                {buyerInfo.fullname || ship.fullname || "N/A"}
                              </p>
                              <p className="flex items-center gap-1.5 text-gray-600">
                                <Mail size={12} className="text-gray-400" />
                                {buyerInfo.email || ship.email || "N/A"}
                              </p>
                              <p className="flex items-center gap-1.5 text-gray-600">
                                <Phone size={12} className="text-gray-400" />
                                {ship.phone || buyerInfo.phone || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-gray-200/80 pt-3">
                            <h4 className="text-xs font-extrabold text-[#45220e] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                              <MapPin size={14} />
                              Delivery Address
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {typeof ship === "object" ? (
                                <>
                                  {ship.address && <span>{ship.address}, </span>}
                                  {ship.roadArea && <span>{ship.roadArea}, </span>}
                                  {ship.city && <span>{ship.city}, </span>}
                                  {ship.stateName || ship.stateCode ? (
                                    <span>{ship.stateName || ship.stateCode} - </span>
                                  ) : null}
                                  {ship.pincode && <strong>{ship.pincode}</strong>}
                                </>
                              ) : (
                                String(ship)
                              )}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div>
                          <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                            <MapPin size={14} />
                            Shipping Address
                          </h4>
                          <p className="text-xs text-gray-700 leading-relaxed font-medium">
                            <strong className="block font-bold text-gray-900 mb-0.5">
                              {ship.fullname || user?.fullname}
                            </strong>
                            {typeof ship === "object" ? (
                              <>
                                {ship.address && <span>{ship.address}, </span>}
                                {ship.roadArea && <span>{ship.roadArea}, </span>}
                                {ship.city && <span>{ship.city}, </span>}
                                {ship.stateName || ship.stateCode ? (
                                  <span>{ship.stateName || ship.stateCode} - </span>
                                ) : null}
                                {ship.pincode && <strong>{ship.pincode}</strong>}
                              </>
                            ) : (
                              String(ship)
                            )}
                          </p>
                          {ship.phone && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Phone size={12} />
                              Phone: <strong>{ship.phone}</strong>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Financial Footer inside Card */}
                      <div className="border-t border-gray-200/90 pt-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {isSellerView ? "Seller Earnings Subtotal" : "Total Paid"}
                        </span>
                        <span className="text-base sm:text-lg font-black text-black">
                          ₹{isSellerView ? ord.sellerSubtotal || ord.totalAmount : ord.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      {/* Full Order Information Modal (Eye Icon Popup) */}
      {selectedOrderModal && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedOrderModal(null)}
        >
          <div
            className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gray-900 text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 shrink-0">
                  <Package className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-extrabold tracking-tight font-playfair flex items-center gap-2">
                    Order #{selectedOrderModal._id?.substring(selectedOrderModal._id.length - 8).toUpperCase()}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Placed on {selectedOrderModal.createdAt ? new Date(selectedOrderModal.createdAt).toLocaleString("en-IN") : "Recently"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-4 sm:p-7 space-y-6 overflow-y-auto grow custom-scrollbar">
              {/* Status Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-gray-500 uppercase">Order Status:</span>
                  {isSeller ? (
                    <select
                      value={selectedOrderModal.orderStatus || "Processing"}
                      disabled={updatingStatusId === selectedOrderModal._id}
                      onChange={(e) =>
                        handleUpdateStatus(selectedOrderModal._id, e.target.value)
                      }
                      className="cursor-pointer px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                      {selectedOrderModal.orderStatus || "Processing"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-gray-500 uppercase">Payment Status:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {selectedOrderModal.paymentStatus || "Paid"}
                  </span>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Info */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} className="text-black" />
                    Customer Details
                  </h4>
                  <div className="text-xs space-y-1 text-gray-700 font-medium">
                    <p className="font-bold text-gray-900 text-sm">
                      {selectedOrderModal.userId?.fullname || selectedOrderModal.shippingAddress?.fullname || user?.fullname || "Customer"}
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-600 break-all">
                      <Mail size={12} className="shrink-0 text-gray-400" />
                      {selectedOrderModal.userId?.email || selectedOrderModal.shippingAddress?.email || user?.email || "N/A"}
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-600">
                      <Phone size={12} className="shrink-0 text-gray-400" />
                      {selectedOrderModal.shippingAddress?.phone || selectedOrderModal.userId?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-black" />
                    Delivery Address
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    {typeof selectedOrderModal.shippingAddress === "object" ? (
                      <>
                        {selectedOrderModal.shippingAddress?.address && <span>{selectedOrderModal.shippingAddress.address}, </span>}
                        {selectedOrderModal.shippingAddress?.roadArea && <span>{selectedOrderModal.shippingAddress.roadArea}, </span>}
                        {selectedOrderModal.shippingAddress?.city && <span>{selectedOrderModal.shippingAddress.city}, </span>}
                        {selectedOrderModal.shippingAddress?.stateName || selectedOrderModal.shippingAddress?.stateCode ? (
                          <span>{selectedOrderModal.shippingAddress.stateName || selectedOrderModal.shippingAddress.stateCode} - </span>
                        ) : null}
                        {selectedOrderModal.shippingAddress?.pincode && <strong>{selectedOrderModal.shippingAddress.pincode}</strong>}
                      </>
                    ) : (
                      String(selectedOrderModal.shippingAddress || "Standard Address")
                    )}
                  </p>
                </div>
              </div>

              {/* Purchased Products Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-black" />
                  Purchased Items ({selectedOrderModal.items?.length || 0})
                </h4>
                <div className="space-y-2.5">
                  {selectedOrderModal.items?.map((item, idx) => {
                    const prod = item.productid || {};
                    const imgUrl = getMediaUrl(prod.thumbnail || item.thumbnail);
                    const title = item.productName || prod.productName || "Product";
                    const price = item.price || prod.price || 0;
                    const qty = item.quantity || 1;

                    return (
                      <div
                        key={item._id || idx}
                        className="flex items-center gap-3.5 bg-gray-50 p-3 rounded-2xl border border-gray-200/80"
                      >
                        <img
                          src={imgUrl}
                          alt={title}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0"
                          onError={(e) => {
                            e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                          }}
                        />
                        <div className="grow min-w-0">
                          <h5 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 capitalize">
                            {title}
                          </h5>
                          <p className="text-xs text-gray-500 mt-0.5 font-medium">
                            ₹{price} × {qty}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-extrabold text-black">
                            ₹{price * qty}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-gray-900 text-white p-4 sm:p-5 rounded-2xl space-y-2 text-xs sm:text-sm font-semibold">
                <div className="flex justify-between text-gray-300">
                  <span>Payment Method:</span>
                  <span className="text-amber-400 font-bold">{selectedOrderModal.paymentMethod || "Online Payment"}</span>
                </div>
                {selectedOrderModal.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount ({selectedOrderModal.couponCode}):</span>
                    <span>-₹{selectedOrderModal.discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-gray-800 pt-2 flex justify-between text-sm sm:text-base font-extrabold">
                  <span>Total Amount Paid:</span>
                  <span className="text-lg text-white font-mono">
                    ₹{selectedOrderModal.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 text-right shrink-0">
              <button
                type="button"
                onClick={() => setSelectedOrderModal(null)}
                className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close Information
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Update Order Status Dialogue Box */}
      {statusModalOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setStatusModalOrder(null)}
        >
          <div
            className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 space-y-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-bold shrink-0">
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 font-playfair">
                    Update Order Status
                  </h3>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Order #{statusModalOrder._id?.substring(statusModalOrder._id.length - 8).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white text-gray-500 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Status Options Cards */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Select New Status:
              </label>

              {[
                {
                  id: "Processing",
                  label: "Processing",
                  desc: "Order received & being prepared",
                  icon: Clock,
                  activeClass: "border-amber-500 bg-amber-50/70 text-amber-900",
                },
                {
                  id: "Shipped",
                  label: "Shipped",
                  desc: "Order dispatched with courier",
                  icon: Truck,
                  activeClass: "border-blue-500 bg-blue-50/70 text-blue-900",
                },
                {
                  id: "Delivered",
                  label: "Delivered",
                  desc: "Order successfully delivered to customer",
                  icon: CheckCircle2,
                  activeClass: "border-emerald-500 bg-emerald-50/70 text-emerald-900",
                },
                {
                  id: "Cancelled",
                  label: "Cancelled",
                  desc: "Cancel order & restock product stock",
                  icon: XCircle,
                  activeClass: "border-red-500 bg-red-50/70 text-red-900",
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = pendingStatus === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setPendingStatus(item.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? item.activeClass
                        : "border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${isSelected ? "bg-white border-current" : "bg-white border-gray-200"}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold capitalize">
                          {item.label}
                        </h4>
                        <p className="text-[11px] text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-black bg-black" : "border-gray-300"}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingStatusId === statusModalOrder._id}
                onClick={async () => {
                  await handleUpdateStatus(statusModalOrder._id, pendingStatus);
                  setStatusModalOrder(null);
                }}
                className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md flex items-center gap-2"
              >
                {updatingStatusId === statusModalOrder._id ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                <span>Update Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
