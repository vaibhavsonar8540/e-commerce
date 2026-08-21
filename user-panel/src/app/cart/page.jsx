"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, updateCartQtyAction, removeFromCartAction } from "@/redux/action/commonAction";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

import { getMediaUrl, DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/imageUrl";

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.common);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQtyChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    try {
      await dispatch(updateCartQtyAction(productId, newQty));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update item quantity.");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCartAction(productId));
      toast.success("Item removed from cart.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove item.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 mb-5 shadow-inner">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-playfair">
          Please Sign In
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          You must be logged in to view your shopping cart. Log in to checkout your items.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition duration-200 text-sm shadow-md cursor-pointer"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200/80 pb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 self-start text-sm font-semibold text-gray-700 hover:text-black bg-transparent transition cursor-pointer py-1"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-playfair">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Provide payment details and review your selected item summary.
            </p>
          </div>
        </div>

        {/* Content Columns Wrapper */}
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
            <p className="text-sm font-semibold text-gray-500">Retrieving shopping cart...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-5">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400 mb-4 shadow-inner">
              <ShoppingBag size={26} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Your Cart is Empty</h3>
            <p className="text-sm text-gray-405 leading-relaxed max-w-md mx-auto">
              Ready to shop? Explore our premium selections and find the perfect fashion items for your wardrobe.
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-900 text-white font-semibold text-sm rounded-xl transition cursor-pointer">
                <span>Start Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Side: Product List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const prod = item.product || {};
                const imgUrl = getMediaUrl(prod.thumbnail);
                
                return (
                  <div key={prod._id} className="bg-white border border-gray-200/85 p-4 rounded-3xl flex gap-4 items-center shadow-sm relative group hover:shadow-md transition">
                    
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-2 border border-gray-100">
                      <img
                        src={imgUrl}
                        alt={prod.productName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>

                    <div className="grow min-w-0 flex flex-col justify-between self-stretch py-1">
                      {/* Product Name & Price below it */}
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 line-clamp-1 capitalize">
                          {prod.productName}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm sm:text-base font-extrabold text-black">
                            ₹{item.itemTotal}
                          </span>
                          {prod.price && (prod.price * item.quantity > item.itemTotal) && (
                            <span className="text-xs text-gray-400 line-through font-medium">
                              ₹{prod.price * item.quantity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Quantity Selector + Delete Button */}
                      <div className="flex items-center gap-3 mt-2">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                          <button
                            onClick={() => handleQtyChange(prod._id, item.quantity, -1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-500 disabled:opacity-50 disabled:hover:bg-transparent transition cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(prod._id, item.quantity, 1)}
                            disabled={item.quantity >= prod.stock}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-500 disabled:opacity-50 disabled:hover:bg-transparent transition cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Delete Item Button after quantity */}
                        <button
                          onClick={() => handleRemoveItem(prod._id)}
                          className="p-2 rounded-xl text-gray-450 hover:text-red-600 hover:bg-red-50/50 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Right Side: Order Summary */}
            <div className="bg-white border border-gray-200/85 p-6 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3.5">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm font-semibold">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-800">₹{cart.subTotal}</span>
                </div>

                {cart.discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>First purchase discount (10%)</span>
                    <span>-₹{cart.discountApplied.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>Delivery fee</span>
                  <span className="text-emerald-600">Free</span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{cart.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/order"
                  className="w-full py-3.5 bg-black hover:bg-gray-950 text-white font-bold rounded-2xl transition shadow-md hover:shadow-lg text-sm text-center cursor-pointer flex items-center justify-center gap-2 block"
                >
                  <span>Proceed to Order</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
