"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import { User, Mail, Phone, Calendar, LogOut, Edit2, Save, X } from "lucide-react";
import { logout, updateUser } from "@/redux/slices/authSlice";
import api from "@/utils/axiosInstant";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setPhone(user.phone || "");
    }
  }, [user]);

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
      console.error(err);
      toast.error(err?.response?.data?.message || "An error occurred while updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-55/30 p-4">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-8 max-w-md w-full text-center shadow-sm space-y-6">
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

  return (
    <div className="min-h-screen bg-gray-55/30 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
        
        {/* Profile Card Header */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-[#f9ece5] text-[#45220e] rounded-full flex items-center justify-center border-4 border-[#f9ece5] font-playfair font-black text-3xl shadow-md">
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="text-center sm:text-left flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#45220e] font-playfair">
                {user?.fullname}
              </h1>
            </div>
            <p className="text-sm text-gray-405">Account status active</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl cursor-pointer hover:bg-gray-100 hover:text-black transition"
              >
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFullname(user?.fullname || "");
                  setPhone(user?.phone || "");
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-750 font-semibold text-sm rounded-xl cursor-pointer hover:bg-gray-100 transition"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 text-red-600 font-semibold text-sm rounded-xl cursor-pointer hover:bg-red-100 hover:text-red-700 transition"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Profile Parameters Details Card */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-800">Account Details</h3>
            <p className="text-xs text-gray-400 mt-1">Personal details registered to this account</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fullname */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 shrink-0">
                  <User size={18} />
                </div>
                <div className="space-y-1.5 w-full">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Full Name</p>
                  {!isEditing ? (
                    <p className="text-sm sm:text-base font-semibold text-[#45220e]">{user?.fullname}</p>
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

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div className="space-y-1.5 w-full">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Email Address</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-500 break-all bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div className="space-y-1.5 w-full">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Phone</p>
                  {!isEditing ? (
                    <p className="text-sm sm:text-base font-semibold text-[#45220e]">
                      {user?.phone || "No phone number added"}
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
                /* Created At */
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Member Since</p>
                    <p className="text-sm sm:text-base font-semibold text-[#45220e]">{joinDate}</p>
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#45220e] hover:bg-[#34180a] text-white font-bold rounded-xl transition duration-200 text-sm cursor-pointer shadow-md hover:shadow-lg disabled:bg-gray-400"
                >
                  {updating ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
