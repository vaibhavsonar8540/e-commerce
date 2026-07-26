"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/../public/images/logo.png";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Disable scroll while splash screen is showing
    document.body.style.overflow = "hidden";

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFade(true);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "";
          }, 500); // 500ms fade out transition
          return 100;
        }
        // Increment progress for realistic loading effect
        const step = Math.floor(Math.random() * 20) + 10;
        return Math.min(prev + step, 100);
      });
    }, 100);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      id="splash-screen"
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center px-6 text-center max-w-xs sm:max-w-sm md:max-w-md w-full">
        {/* Centered Logo */}
        <div className="relative mb-6 sm:mb-8 transition-transform duration-300 transform hover:scale-105">
          <Image
            src={logo}
            alt="Velora Logo"
            priority
            className="w-36 sm:w-44 md:w-56 h-auto object-contain drop-shadow-sm"
          />
        </div>

        {/* Loading Bar Container */}
        <div className="w-full bg-gray-100 h-2 sm:h-2.5 rounded-full overflow-hidden relative shadow-inner border border-gray-100">
          <div
            className="bg-primary h-full rounded-full transition-all duration-200 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Percentage & Status */}
        <div className="flex items-center justify-between w-full mt-3 text-[11px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase">
          <span>Loading Experience</span>
          <span className="text-primary">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
