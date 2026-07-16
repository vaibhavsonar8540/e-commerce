"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./sidebar/sidebar";
import Login from "@/app/login/page";
import { getLoggedInUser } from "@/redux/action/authAction";
import { Loader2, Menu, X } from "lucide-react";

const AppContent = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  // Close sidebar on path navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-10 h-10 animate-spin text-black" />
          <p className="text-gray-500 font-medium text-sm">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // केस 1: अगर यूजर लॉगिन नहीं है, तो बिना Sidebar के सिर्फ लॉगिन कंपोनेंट दिखाएं
  if (!isAuthenticated) {
    return <Login />;
  }

  // केस 2: अगर यूजर लॉगिन है, तो Sidebar के साथ पूरा लेआउट दिखाएं (Supporting responsive mobile drawers)
  return (
    <div className="flex min-h-screen relative bg-gray-50">
      {/* Mobile top-bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-250 flex items-center justify-between px-4 z-40 shadow-sm">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <span className="font-bold text-gray-800 tracking-wide font-playfair uppercase">Velora Admin</span>
        <div className="w-6"></div>
      </div>

      {/* Sidebar - Desktop: fixed flex box, Mobile: overlay drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:flex
      `}>
        {/* Sidebar wrapper */}
        <div className="relative shadow-xl md:shadow-none h-screen bg-white">
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-5 right-5 p-2 rounded-lg text-gray-650 hover:bg-gray-100 z-10"
          >
            <X size={20} />
          </button>
          
          <Sidebar />
        </div>
      </div>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/45 z-30 transition-opacity"
        />
      )}

      {/* Main panel container */}
      <main className="flex-1 min-h-screen pt-16 md:pt-0 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AppContent;