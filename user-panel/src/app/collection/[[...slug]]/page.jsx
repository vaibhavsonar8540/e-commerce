"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/utils/axiosInstant";
import ProductCard from "@/components/productCard";
import { ChevronRight, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CollectionPage({ params }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug || [];
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortByDate, setSortByDate] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { collection: collectionsList, categories: categoriesList, subCategories: subcategoriesList } = useSelector(
    (state) => state.common
  );

  const collectionSlug = slug[0] || "";
  const categorySlug = slug[1] || "";
  const subcategorySlug = slug[2] || "";

  // Resolve Names for Breadcrumbs & Title
  const activeCollection = collectionsList?.find((c) => c.slug === collectionSlug);
  const activeCategory = categoriesList?.find((c) => c.slug === categorySlug);
  const activeSubcategory = subcategoriesList?.find((c) => c.slug === subcategorySlug);

  // Sync state filters with URL slugs when page changes or config loads
  useEffect(() => {
    if (activeCategory) {
      setSelectedCategory(activeCategory._id);
    } else {
      setSelectedCategory("");
    }
  }, [categorySlug, activeCategory]);

  useEffect(() => {
    if (activeSubcategory) {
      setSelectedSubcategory(activeSubcategory._id);
    } else {
      setSelectedSubcategory("");
    }
  }, [subcategorySlug, activeSubcategory]);

  // Filter categories based on active collection
  const pageCategories = (categoriesList || []).filter((c) => {
    if (!activeCollection?._id) return true;
    const catColId = typeof c.collectionName === "object" ? c.collectionName?._id : c.collectionName;
    return String(catColId) === String(activeCollection._id);
  });

  // Filter subcategories based on selected category
  const pageSubcategories = (subcategoriesList || []).filter((s) => {
    if (!selectedCategory) return false;
    const subCatId = typeof s.category === "object" ? s.category?._id : s.category;
    return String(subCatId) === String(selectedCategory);
  });

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubcategory("");
  };

  // Filtered & Sorted products list to render
  const filteredProducts = products
    .filter((prod) => {
      const prodCat = typeof prod.category === "object" ? prod.category?._id : prod.category;
      const prodSub = typeof prod.subCategory === "object" ? prod.subCategory?._id : (typeof prod.subcategory === "object" ? prod.subcategory?._id : (prod.subCategory || prod.subcategory));

      if (selectedCategory && String(prodCat) !== String(selectedCategory)) {
        return false;
      }
      if (selectedSubcategory && String(prodSub) !== String(selectedSubcategory)) {
        return false;
      }
      if (minPrice && prod.price < Number(minPrice)) {
        return false;
      }
      if (maxPrice && prod.price > Number(maxPrice)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortByDate === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortByDate === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return 0;
    });

  const displayTitle = collectionSlug === "search"
    ? `Search Results for "${searchQuery}"`
    : activeSubcategory?.name || activeCategory?.name || activeCollection?.name || "All Products";

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        let response;
        if (collectionSlug === "search") {
          response = await api.get("/filer/product", {
            params: { query: searchQuery }
          });
        } else {
          response = await api.get("/product/get-filtered", {
            params: {
              collectionSlug,
            },
          });
        }

        if (response.data?.success) {
          setProducts(response.data.products || []);
        } else {
          setErrorMessage("Failed to filter catalog products.");
        }
      } catch (err) {
        setErrorMessage("Network error: Unable to retrieve collection details.");
      } finally {
        setLoading(false);
      }
    }

    if (collectionSlug) {
      fetchFilteredProducts();
    } else {
      setLoading(false);
    }
  }, [collectionSlug, categorySlug, subcategorySlug, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gray-500 font-medium">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight size={14} className="text-gray-400" />
          
          {activeCollection && (
            <>
              <Link href={`/collection/${activeCollection.slug}`} className={`hover:text-primary transition ${!categorySlug ? "text-primary font-bold" : ""}`}>
                {activeCollection.name}
              </Link>
            </>
          )}

          {activeCategory && (
            <>
              <ChevronRight size={14} className="text-gray-400" />
              <Link href={`/collection/${activeCollection.slug}/${activeCategory.slug}`} className={`hover:text-primary transition ${!subcategorySlug ? "text-primary font-bold" : ""}`}>
                {activeCategory.name}
              </Link>
            </>
          )}

          {activeSubcategory && (
            <>
              <ChevronRight size={14} className="text-gray-400" />
              <span className="text-primary font-bold">{activeSubcategory.name}</span>
            </>
          )}
        </div>

        {/* Collection title banner */}
        <div className="border-b border-gray-205 pb-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair capitalize">
            {displayTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse through our curated collection entries.
          </p>
        </div>

        {/* Filters Container */}
        {collectionSlug !== "search" && (
          <>
            {/* MOBILE FILTER TRIGGER BAR & DRAWER (Small screens only) */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="w-full bg-[#F8F8F8] border border-gray-200 py-3.5 px-5 rounded-2xl flex items-center justify-between font-bold text-gray-800 text-sm shadow-xs cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal size={18} className="text-[#45220e]" />
                  <span className="text-sm font-extrabold tracking-tight text-gray-900">
                    Filter & Sort Products
                  </span>
                  {(selectedCategory || selectedSubcategory || minPrice || maxPrice || sortByDate !== "newest") && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#45220e] inline-block"></span>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-300 ${
                    isMobileFilterOpen ? "rotate-180 text-black" : ""
                  }`}
                />
              </button>

              {/* MOBILE FILTER DRAWER */}
              {isMobileFilterOpen && (
                <div className="mt-3 bg-[#F8F8F8] border border-gray-200 p-5 rounded-2xl space-y-4 shadow-md transition-all duration-300 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                      Refine Catalog
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-200 transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Filter by Category */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Filter by Category
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="appearance-none w-full py-2.5 px-4 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition text-gray-700 bg-white text-sm cursor-pointer shadow-xs"
                        >
                          <option value="">All Categories ({pageCategories.length})</option>
                          {pageCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Filter by Subcategory */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Filter by Subcategory
                      </label>
                      <div className="relative">
                        <select
                          value={selectedSubcategory}
                          onChange={(e) => setSelectedSubcategory(e.target.value)}
                          disabled={!selectedCategory}
                          className="appearance-none w-full py-2.5 px-4 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition text-gray-700 bg-white text-sm cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed shadow-xs"
                        >
                          <option value="">
                            {selectedCategory ? `All Subcategories (${pageSubcategories.length})` : "Select a category first"}
                          </option>
                          {pageSubcategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Sort by Date */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Sort by Date
                      </label>
                      <div className="relative">
                        <select
                          value={sortByDate}
                          onChange={(e) => setSortByDate(e.target.value)}
                          className="appearance-none w-full py-2.5 px-4 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition text-gray-700 bg-white text-sm cursor-pointer shadow-xs"
                        >
                          <option value="newest">Newly Uploaded</option>
                          <option value="oldest">Oldest Uploaded</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Price Range ($)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full py-2.5 px-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm text-gray-700 bg-white placeholder:text-gray-400 shadow-xs"
                        />
                        <span className="text-gray-400 text-xs">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full py-2.5 px-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm text-gray-700 bg-white placeholder:text-gray-400 shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200/60">
                    {(selectedCategory || selectedSubcategory || minPrice || maxPrice || sortByDate !== "newest") && (
                      <button
                        onClick={() => {
                          setSelectedCategory("");
                          setSelectedSubcategory("");
                          setSortByDate("newest");
                          setMinPrice("");
                          setMaxPrice("");
                        }}
                        className="px-4 py-2 bg-red-50 border border-red-200 text-xs font-bold text-red-600 rounded-xl hover:bg-red-100 transition cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="ml-auto bg-black hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs"
                    >
                      Close & View ({filteredProducts.length})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DESKTOP FILTERS CONTAINER (Large screens - UNTOUCHED) */}
            <div className="hidden lg:block bg-[#F8F8F8] border border-gray-200 p-5 sm:p-6 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filter by Category */}
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Filter by Category
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="appearance-none w-full py-2.5 px-4 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition text-gray-700 bg-white text-sm cursor-pointer shadow-xs"
                    >
                      <option value="">All Categories ({pageCategories.length})</option>
                      {pageCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Filter by Subcategory */}
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Filter by Subcategory
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      disabled={!selectedCategory}
                      className="appearance-none w-full py-2.5 px-4 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition text-gray-700 bg-white text-sm cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed shadow-xs"
                    >
                      <option value="">
                        {selectedCategory ? `All Subcategories (${pageSubcategories.length})` : "Select a category first"}
                      </option>
                      {pageSubcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Sort by Date */}
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Sort by Date
                  </label>
                  <div className="relative">
                    <select
                      value={sortByDate}
                      onChange={(e) => setSortByDate(e.target.value)}
                      className="appearance-none w-full py-2.5 px-4 pr-10 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition text-gray-700 bg-white text-sm cursor-pointer shadow-xs"
                    >
                      <option value="newest">Newly Uploaded</option>
                      <option value="oldest">Oldest Uploaded</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Price Range Filteration */}
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Price Range ($)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full py-2.5 px-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm text-gray-700 bg-white placeholder:text-gray-400 shadow-xs"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full py-2.5 px-3 border border-gray-200 rounded-xl outline-none focus:border-gray-400 text-sm text-gray-700 bg-white placeholder:text-gray-400 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200/60">
                {(selectedCategory || selectedSubcategory || minPrice || maxPrice || sortByDate !== "newest") && (
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setSelectedSubcategory("");
                      setSortByDate("newest");
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="px-4 py-2.5 bg-red-50 border border-red-200 text-xs font-bold text-red-600 rounded-xl hover:bg-red-100 transition cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  type="button"
                  className="bg-black hover:bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}

        {/* Products Listing Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
            <p className="text-sm font-semibold text-gray-500">Curating products...</p>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 text-red-700/90 border border-red-200/50 p-5 rounded-2xl text-center font-medium">
            <p>{errorMessage}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="w-16 h-16 bg-gray-105 rounded-2xl flex items-center justify-center mx-auto text-gray-400 mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Catalog Products Found</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
              There are currently no products matching this filter combination.
            </p>
            <div className="pt-2">
              <button onClick={() => { setSelectedCategory(""); setSelectedSubcategory(""); setMinPrice(""); setMaxPrice(""); }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white font-semibold text-sm rounded-xl transition cursor-pointer">
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xss:grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod._id} data={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
