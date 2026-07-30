"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import { User, Mail, Phone, Calendar, LogOut, Edit2, Save, X, Key, Store, ArrowLeft, Trash2 } from "lucide-react";
import { logout, updateUser } from "@/redux/slices/authSlice";
import api from "@/utils/axiosInstant";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("profile"); // profile, change-password, your-store
  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [updating, setUpdating] = useState(false);

  // Store products states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Product edit states
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductForm, setEditingProductForm] = useState({
    productName: "",
    description: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
  });
  const [editingProductSubmitting, setEditingProductSubmitting] = useState(false);

  // Form states for password changes (UI ONLY)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Fetch store products if user is seller/admin
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await api.get("/product/my-products");
      if (response.data?.success) {
        setProducts(response.data.products || []);
      }
    } catch (err) {
      // catch silently
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && (user?.role === "seller" || user?.role === "admin")) {
      fetchProducts();
    }
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullname.trim() || !phone.trim()) {
      toast.error("Name and phone number cannot be empty.");
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setUpdating(true);
    try {
      const response = await api.put("/user/update-profile", { fullname, phone });
      if (response.data?.success) {
        dispatch(updateUser(response.data.user));
        toast.success(response.data.message || "Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile details.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred while updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.info("Password update feature and validation API is coming soon!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Product Delete Handler
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await api.delete(`/product/delete/${id}`);
        if (response.data?.success) {
          toast.success("Product deleted successfully!");
          setProducts((prev) => prev.filter((p) => p._id !== id));
        } else {
          toast.error(response.data?.message || "Failed to delete product.");
        }
      } catch (err) {
        toast.error("Error deleting product.");
      }
    }
  };

  // Product Edit Initiator
  const handleStartEditProduct = (product) => {
    setEditingProduct(product);
    setEditingProductForm({
      productName: product.productName || "",
      description: product.description || "",
      price: product.price || 0,
      discountPrice: product.discountPrice || 0,
      stock: product.stock || 0,
    });
  };

  // Product Edit Submit Handler
  const handleProductEditSubmit = async (e) => {
    e.preventDefault();
    if (editingProductForm.discountPrice > editingProductForm.price) {
      toast.error("Discount price cannot exceed original price.");
      return;
    }

    setEditingProductSubmitting(true);
    try {
      const response = await api.put(`/product/update/${editingProduct._id}`, editingProductForm);
      if (response.data?.success) {
        toast.success("Product details updated successfully!");
        setEditingProduct(null);
        // Refresh list
        fetchProducts();
      } else {
        toast.error(response.data?.message || "Failed to update product details.");
      }
    } catch (err) {
      toast.error("Failed to edit product.");
    } finally {
      setEditingProductSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 p-4">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-8 max-w-md w-full text-center shadow-sm space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#f9ece5] text-[#45220e] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <User size={28} />
          </div>
          <h2 className="text-2xl font-bold font-playfair text-[#45220e]">Access Profile Catalog</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Please log in or register an account to view and customize your account parameters, order entries, and seller options.
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

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "change-password", label: "Change Password", icon: Key },
  ];

  // Conditional addition of "Your Store"
  if (user?.role === "seller" || user?.role === "admin") {
    menuItems.push({ id: "your-store", label: "Your Store", icon: Store });
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Row with dynamic total product counters */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4.5 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer hover:bg-gray-100 transition shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          
          {(user?.role === "seller" || user?.role === "admin") && (
            <div className="flex items-center gap-3">
              <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-full font-bold shadow-sm">
                Total Store Products: {products.length}
              </span>
            </div>
          )}
        </div>

        {/* Dashboard Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Column Tabs Sidebar */}
          <div className="lg:sticky lg:top-24 col-span-1 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-max lg:min-h-137">
            <div className="space-y-6">
              {/* Profile info on top */}
              <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-[#f9ece5] text-[#45220e] rounded-full flex items-center justify-center border-4 border-[#f9ece5] font-playfair font-black text-2xl shadow-sm select-none">
                  {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "?"}
                </div>
                <h2 className="text-lg font-extrabold text-[#45220e] font-playfair capitalize">
                  {user?.fullname}
                </h2>
              </div>

              {/* Navigation Options list */}
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsEditing(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#45220e] text-white shadow"
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-white" : "text-gray-400"} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout button at the bottom */}
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-750 transition duration-200 cursor-pointer"
              >
                <LogOut size={16} className="text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Right Column Config Panel Details */}
          <div className="lg:col-span-3 bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm min-h-75">
            
            {/* Active tab content: PROFILE */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Account Details</h3>
                    <p className="text-xs text-gray-450 mt-1">Personal accounts credentials stored in database</p>
                  </div>
                  <div>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer hover:bg-gray-50 transition"
                      >
                        <Edit2 size={13} />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFullname(user?.fullname || "");
                          setPhone(user?.phone || "");
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer hover:bg-gray-50 transition"
                      >
                        <X size={13} />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-450 shrink-0">
                        <User size={18} />
                      </div>
                      <div className="space-y-1 w-full">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-wide">Full Name</p>
                        {!isEditing ? (
                          <p className="text-sm sm:text-base font-semibold text-[#45220e] capitalize">{user?.fullname}</p>
                        ) : (
                          <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full py-2 px-3 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm font-semibold"
                            required
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#45220e]/60 shrink-0">
                        <Mail size={18} />
                      </div>
                      <div className="space-y-1 w-full">
                        <p className="text-[10px] text-gray-405 uppercase font-black tracking-wide">Email Address</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-500 break-all bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-450 shrink-0">
                        <Phone size={18} />
                      </div>
                      <div className="space-y-1 w-full">
                        <p className="text-[10px] text-gray-450 uppercase font-black tracking-wide">Phone Number</p>
                        {!isEditing ? (
                          <p className="text-sm sm:text-base font-semibold text-[#45220e]">
                            {user?.phone || "No phone linked"}
                          </p>
                        ) : (
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full py-2 px-3 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm font-semibold"
                            required
                          />
                        )}
                      </div>
                    </div>

                    {joinDate && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-450 shrink-0">
                          <Calendar size={18} />
                        </div>
                        <div className="space-y-1 w-full">
                          <p className="text-[10px] text-gray-455 uppercase font-black tracking-wide">Member Since</p>
                          <p className="text-sm sm:text-base font-semibold text-[#45220e]">{joinDate}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-4 border-t border-gray-150">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#45220e] hover:bg-[#34180a] text-white font-bold rounded-xl transition duration-200 text-xs sm:text-sm cursor-pointer shadow disabled:bg-gray-400"
                      >
                        {updating ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          <Save size={14} />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Active tab content: CHANGE PASSWORD */}
            {activeTab === "change-password" && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                  <p className="text-xs text-gray-450 mt-1">Configure a new secure password code for login safety</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full py-3 px-4 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full py-3 px-4 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full py-3 px-4 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#45220e] hover:bg-[#34180a] text-white font-bold rounded-xl transition text-xs sm:text-sm cursor-pointer shadow"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Active tab content: YOUR STORE */}
            {activeTab === "your-store" && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Store Profile Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-l font-bold text-gray-800">Your Store Registry</h3>
                    <p className="text-xs text-gray-450 mt-1">Verified seller credentials and store registration logs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 w-full bg-gray-50/50 p-4 border border-gray-100 rounded-2xl">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wide">Store / Business Name</p>
                      <p className="text-sm sm:text-base font-bold text-gray-800 capitalize leading-relaxed">
                        {user?.businessName || "Zara Boutique Veloza Store"}
                      </p>
                    </div>



                    <div className="md:col-span-2 space-y-1 w-full bg-gray-50/55 p-4 border border-gray-100 rounded-2xl">
                      <p className="text-[10px] text-gray-405 uppercase font-black tracking-wide">Registered Business Address</p>
                      <p className="text-sm sm:text-base font-semibold text-gray-750 leading-relaxed capitalize">
                        {user?.address || "12, Fashion Hub Complex, Outer Ring Road, New Delhi - 110001, India"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seller Created Products list section */}
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Your Products</h3>
                      <p className="text-xs text-gray-450 mt-1">Manage and edit your listed store products catalog</p>
                    </div>
                    <div>
                      <Link
                        href="/add-product"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition inline-block"
                      >
                        + Add Product
                      </Link>
                    </div>
                  </div>

                  {loadingProducts ? (
                    <div className="flex items-center justify-center py-10">
                      <span className="w-8 h-8 border-4 border-t-[#45220e] border-[#45220e]/20 rounded-full animate-spin"></span>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-200 rounded-3xl space-y-4">
                      <Store className="w-12 h-12 text-gray-300 mx-auto" />
                      <p className="text-sm font-bold text-gray-500">No products listed in your store yet.</p>
                      <Link
                        href="/add-product"
                        className="inline-block px-5 py-2.5 bg-[#45220e] hover:bg-[#34180a] text-white text-xs font-bold rounded-2xl shadow transition"
                      >
                        Create Your First Catalog
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product) => {
                        const priceToRender = product.discountPrice ?? product.price;
                        return (
                          <div
                            key={product._id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-150 rounded-2xl p-4 gap-4 bg-gray-50/20 hover:bg-gray-50/60 transition duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={getMediaUrl(product.thumbnail || product.images?.[0]) || DEFAULT_PLACEHOLDER_IMAGE}
                                alt={product.productName}
                                className="w-16 h-16 object-cover rounded-xl border border-gray-200/80 shrink-0"
                                onError={(e) => {
                                  e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                                }}
                              />
                              <div className="space-y-1">
                                <h4 className="font-bold text-gray-800 text-sm sm:text-base capitalize leading-snug">
                                  {product.productName}
                                </h4>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <p className="text-xs text-gray-450">
                                    Stock: <span className="font-bold text-gray-700">{product.stock}</span>
                                  </p>
                                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                                    {product.status || "Active"}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-amber-900 pt-0.5">
                                  ₹ {priceToRender}
                                  {product.discountPrice && (
                                    <span className="text-[10px] text-gray-400 line-through pl-1.5 font-normal">
                                      ₹ {product.price}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 sm:self-center self-end">
                              <button
                                onClick={() => handleStartEditProduct(product)}
                                className="px-4 py-2 border border-gray-250 text-gray-700 font-bold text-xs rounded-xl hover:bg-white transition cursor-pointer hover:shadow-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 transition cursor-pointer hover:shadow-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Edit Product Modal Form Dialog Container */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in duration-200">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute right-5 top-5 text-gray-400 hover:text-black cursor-pointer bg-gray-50/50 p-1.5 rounded-full hover:bg-gray-150 transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold font-playfair text-[#45220e] border-b pb-3 mb-5 leading-none">
              Edit Product Details
            </h3>

            <form onSubmit={handleProductEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-505 uppercase tracking-wide">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProductForm.productName}
                  onChange={(e) => setEditingProductForm({ ...editingProductForm, productName: e.target.value })}
                  className="w-full py-2.5 px-3.5 border border-gray-250 rounded-xl outline-none focus:border-black text-sm text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-550 uppercase tracking-wide">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editingProductForm.description}
                  onChange={(e) => setEditingProductForm({ ...editingProductForm, description: e.target.value })}
                  className="w-full py-2.5 px-3.5 border border-gray-250 rounded-xl outline-none focus:border-black text-sm text-gray-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-550 uppercase tracking-wide">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProductForm.price}
                    onChange={(e) => setEditingProductForm({ ...editingProductForm, price: Number(e.target.value) })}
                    className="w-full py-2.5 px-3.5 border border-gray-250 rounded-xl outline-none focus:border-black text-sm text-gray-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-550 uppercase tracking-wide">Discount Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProductForm.discountPrice}
                    onChange={(e) => setEditingProductForm({ ...editingProductForm, discountPrice: Number(e.target.value) })}
                    className="w-full py-2.5 px-3.5 border border-gray-250 rounded-xl outline-none focus:border-black text-sm text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-550 uppercase tracking-wide">Stock Quantity</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editingProductForm.stock}
                  onChange={(e) => setEditingProductForm({ ...editingProductForm, stock: Number(e.target.value) })}
                  className="w-full py-2.5 px-3.5 border border-gray-250 rounded-xl outline-none focus:border-black text-sm text-gray-800"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-55 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editingProductSubmitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:bg-gray-400 shadow-sm"
                >
                  {editingProductSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
