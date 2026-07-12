"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./sidebar/sidebar";
import Login from "@/app/login/page";

const AppContent = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // अगर यूजर लॉगिन नहीं है, तो उसे हमेशा लॉगिन पेज पर रखें
    if (!isAuthenticated) {
      router.push("/login");
    } else if (pathname === "/login") {
      // अगर यूजर लॉगिन है और जबरदस्ती /login पर जाने की कोशिश करे, तो डैशबोर्ड भेजें
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, pathname]);

  // केस 1: अगर यूजर लॉगिन नहीं है, तो बिना Sidebar के सिर्फ लॉगिन कंपोनेंट दिखाएं
  if (!isAuthenticated) {
    return <Login />;
  }

  // केस 2: अगर यूजर लॉगिन है, तो Sidebar के साथ पूरा लेआउट दिखाएं
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AppContent;