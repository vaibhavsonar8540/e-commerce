"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/../public/images/logo.png";
import { contactEmail, contactPhone, contactAddress } from "@/utils/environment";

export default function Footer() {
  const { collection: collectionsList } = useSelector((state) => state.common);

  const defaultCollections = [
    { name: "Women", slug: "women" },
    { name: "Men", slug: "men" },
    { name: "Kids", slug: "kids" },
    { name: "Home & Kitchen", slug: "home-and-kitchen" },
    { name: "Beauty", slug: "beauty" },
    { name: "Electronics", slug: "electronics" },
    { name: "Watches", slug: "watches" }
  ];

  const displayedCollections = (collectionsList && collectionsList.length > 0)
    ? collectionsList
    : defaultCollections;

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Logo & Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src={logo}
                alt="Velora Logo"
                className="w-64 object-contain"
                priority
              />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Velora is a boutique curation of modern lifestyles, offering refined essentials with seamless cross-category service and verified quality checkouts.
            </p>
            <div className="space-y-3 font-semibold text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                <span>{contactAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                <span>{contactPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <span>{contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Collections</h4>
            <ul className="space-y-2.5 text-sm font-semibold text-gray-600">
              {displayedCollections.map((col) => (
                <li key={col.slug}>
                  <Link href={`/collection/${col.slug}`} className="hover:text-[#45220e] transition-colors">
                    {col.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Info & Sitemap */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Quick Links</h4>
            <ul className="space-y-2.5 text-sm font-semibold text-gray-600">
              <li>
                <Link href="/contact-us" className="hover:text-[#45220e] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-[#45220e] transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Policies */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Legal Details</h4>
            <ul className="space-y-2.5 text-sm font-semibold text-gray-600">
              <li>
                <Link href="/return-policy" className="hover:text-[#45220e] transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#45220e] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#45220e] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col items-center justify-center text-center gap-6">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} Velora Shop. All rights reserved. Made for premium experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}