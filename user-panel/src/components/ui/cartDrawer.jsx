"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsCartOpen, setIsModelOpen } from "@/redux/slices/commonSlice";
import { fetchCart, updateCartQtyAction, removeFromCartAction } from "@/redux/action/commonAction";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { isCartOpen, cart } = useSelector((state) => state.common);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && isCartOpen) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated, isCartOpen]);

  const handleUpdateQuantity = async (productId, currentQty, delta) => {
    const targetQty = currentQty + delta;
    try {
      await dispatch(updateCartQtyAction(productId, targetQty));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCartAction(productId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/45 z-40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => dispatch(setIsCartOpen(false))}
      />

      {/* Cart drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#45220e]" />
            <h2 className="text-lg font-bold text-gray-900 font-playfair">Your Shop Cart</h2>
          </div>
          <button
            onClick={() => dispatch(setIsCartOpen(false))}
            className="p-1 px-2 text-gray-500 hover:text-black rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <ShoppingBag size={48} className="text-gray-300 stroke-1" />
              <h3 className="font-bold text-gray-800">Your Cart is Locked</h3>
              <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                Please register or sign in to verify your active shopping cart credentials.
              </p>
              <button
                onClick={() => {
                  dispatch(setIsCartOpen(false));
                  dispatch(setIsModelOpen(true));
                }}
                className="px-5 py-2.5 bg-[#45220e] hover:bg-[#34180a] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          ) : !cart?.items || cart.items.length === 0 ? (
            /* High-fidelity Empty state illustration */
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="w-28 h-28 bg-[#f9ece5] rounded-full flex items-center justify-center text-[#45220e] shadow-inner mb-2 animate-pulse">
                {/* SVG Shopping basket icon */}
                <svg className="w-14 h-14 stroke-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-gray-900 font-playfair">Your cart is feeling light</h3>
                <p className="text-xs text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                  Explorer our curated listing collections and find the perfect fashion items matching your style today!
                </p>
              </div>
              <div>
                <button
                  onClick={() => dispatch(setIsCartOpen(false))}
                  className="px-6 py-3 bg-[#45220e] hover:bg-[#34180a] text-white text-xs font-bold rounded-2xl cursor-pointer shadow-md hover:shadow-lg transition"
                >
                  Start Shop Discoveries
                </button>
              </div>
            </div>
          ) : (
            /* Cart items list */
            <div className="space-y-4">
              {cart.items.map((item, index) => {
                if (!item.product) return null;
                const prod = item.product;
                const priceText = prod.discountedPrice || prod.price;

                return (
                  <div key={prod._id || index} className="flex gap-4 p-3 border border-gray-100 rounded-2xl hover:shadow-sm transition">
                    {/* Thumbnail img */}
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${prod.thumbnail}`}
                        alt={prod.productName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=100";
                        }}
                      />
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <h4 className="text-sm font-extrabold text-[#45220e] truncate capitalize">{prod.productName}</h4>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">₹{priceText}</p>
                      </div>

                      {/* Quantity select counter & Delete */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50">
                          <button
                            onClick={() => handleUpdateQuantity(prod._id, item.quantity, -1)}
                            className="p-1 px-2 text-gray-500 hover:text-black cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-gray-800 px-2 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(prod._id, item.quantity, 1)}
                            className="p-1 px-2 text-gray-500 hover:text-black cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Trash delete */}
                        <button
                          onClick={() => handleRemoveItem(prod._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer controls */}
        {isAuthenticated && cart?.items && cart.items.length > 0 && (
          <div className="p-5 border-t border-gray-105 bg-gray-50/50 space-y-4">
            <div className="space-y-1.5 text-sm font-semibold">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{cart.subTotal}</span>
              </div>
              
              {cart.discountApplied > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>First-Order Discount (10%)</span>
                  <span>- ₹{cart.discountApplied}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-[#45220e] pt-1.5 border-t border-gray-200">
                <span>Total Amount</span>
                <span>₹{cart.grandTotal}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  dispatch(setIsCartOpen(false));
                  toast.info("Checkout process simulated.");
                }}
                className="w-full py-3.5 bg-black hover:bg-gray-900 text-white font-bold text-sm rounded-2xl shadow transition cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
