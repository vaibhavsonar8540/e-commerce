"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utils/axiosInstant";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductDetail from "@/components/productDetail";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = React.use(params);
  const productId = unwrappedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.get(`/product/get/${productId}`);
        if (response.data?.success) {
          const prod = response.data.product;
          setProduct(prod);
        } else {
          setErrorMsg("Failed to retrieve product details.");
        }
      } catch (err) {
        setErrorMsg("Product not found or network connection issues.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
        <p className="text-sm font-semibold text-gray-500">Loading catalog item details...</p>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-sm">
          <div className="text-red-500 font-bold text-lg">Error Loading Product</div>
          <p className="text-sm text-gray-500">{errorMsg || "Product not found."}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white text-sm font-semibold rounded-xl">
            <ArrowLeft size={16} />
            <span>Return to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </button>
        </div>

        {/* Product Details Component */}
        <ProductDetail product={product} />

      </div>
    </div>
  );
}
