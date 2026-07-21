"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/utils/axiosInstant";
import ProductCard from "@/components/productCard";
import { ChevronRight, ArrowLeft } from "lucide-react";
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
              categorySlug,
              subcategorySlug,
            },
          });
        }

        if (response.data?.success) {
          setProducts(response.data.products || []);
        } else {
          setErrorMessage("Failed to filter catalog products.");
        }
      } catch (err) {
        console.error(err);
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
        ) : products.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="w-16 h-16 bg-gray-105 rounded-2xl flex items-center justify-center mx-auto text-gray-400 mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Catalog Products Found</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
              There are currently no products available under this collection classification. Please try searching another category.
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white font-semibold text-sm rounded-xl transition">
                <ArrowLeft size={16} />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((prod) => (
              <ProductCard key={prod._id} data={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
