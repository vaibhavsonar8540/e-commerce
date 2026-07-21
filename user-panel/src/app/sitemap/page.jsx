"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Network, HelpCircle, FileText, ShoppingBag, ArrowLeft, Layers, Tag } from "lucide-react";
import { fetchCollection, fetchCategories, fetchSUbCategories } from "@/redux/action/commonAction";

export default function Sitemap() {
  const dispatch = useDispatch();
  const { collection: collectionsList, categories = [], subCategories = [] } = useSelector((state) => state.common);

  useEffect(() => {
    dispatch(fetchCollection());
    dispatch(fetchCategories());
    dispatch(fetchSUbCategories());
  }, [dispatch]);

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
    <div className="min-h-screen bg-white py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom duration-300">
        
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#45220e] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="border-b border-gray-200 pb-6 text-center sm:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#45220e] tracking-tight font-playfair capitalize flex items-center justify-center sm:justify-start gap-3">
            <Network size={32} className="text-[#45220e]" />
            <span>Website Sitemap</span>
          </h1>
          <p className="text-sm text-gray-400">
            Overview and link directory index of Velora E-Commerce Shop.
          </p>
        </div>

        {/* Main Sitemap Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Collections */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShoppingBag size={18} className="text-[#45220e]" />
              <h3 className="font-bold text-gray-800">Collections</h3>
            </div>
            
            <ul className="space-y-3 text-sm font-semibold text-gray-505">
              {displayedCollections.map((col) => (
                <li key={col.slug}>
                  <Link
                    href={`/collection/${col.slug}`}
                    className="hover:text-[#45220e] transition-colors uppercase text-xs tracking-wide text-gray-900 font-bold block"
                  >
                    {col.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Layers size={18} className="text-[#45220e]" />
              <h3 className="font-bold text-gray-800">Categories</h3>
            </div>
            
            <div className="space-y-4">
              {displayedCollections.map((col) => {
                const colCategories = categories.filter(
                  (cat) => cat.collectionName?._id === col._id || cat.collectionName === col._id
                );

                if (colCategories.length === 0) return null;

                return (
                  <div key={col.slug} className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      {col.name}
                    </div>
                    <ul className="space-y-1.5 pl-2 border-l border-gray-100">
                      {colCategories.map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            href={`/collection/${col.slug}/${cat.slug}`}
                            className="hover:text-[#45220e] transition-colors text-xs font-semibold text-gray-700 block"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Subcategories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Tag size={18} className="text-[#45220e]" />
              <h3 className="font-bold text-gray-800">Subcategories</h3>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const catSubs = subCategories.filter(
                  (sub) => sub.category?._id === cat._id || sub.category === cat._id
                );

                if (catSubs.length === 0) return null;

                const colSlug = cat.collectionName?.slug || "";

                return (
                  <div key={cat.slug} className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      {cat.name} <span className="text-[9px] font-normal text-gray-300">({cat.collectionName?.name})</span>
                    </div>
                    <ul className="space-y-1 pl-2 border-l border-gray-100">
                      {catSubs.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/collection/${colSlug}/${cat.slug}/${sub.slug}`}
                            className="hover:text-[#45220e] transition-colors text-[11px] font-medium text-gray-500 block"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 4: Information & Support */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle size={18} className="text-[#45220e]" />
                <h3 className="font-bold text-gray-800">Help & Support</h3>
              </div>
              <ul className="space-y-2.5 text-sm font-semibold text-gray-500">
                <li>
                  <Link href="/contact-us" className="hover:text-[#45220e] transition-colors">
                    Contact Customer Care
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-[#45220e] transition-colors">
                    Sitemap Index
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileText size={18} className="text-[#45220e]" />
                <h3 className="font-bold text-gray-800">Policies</h3>
              </div>
              <ul className="space-y-2.5 text-sm font-semibold text-gray-500">
                <li>
                  <Link href="/return-policy" className="hover:text-[#45220e] transition-colors">
                    Return & Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#45220e] transition-colors">
                    Privacy details Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-[#45220e] transition-colors">
                    Terms & Conditions Agreements
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
