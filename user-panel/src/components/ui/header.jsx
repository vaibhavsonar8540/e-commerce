"use client";

import logo from "@/../public/images/logo.png";
import CustomImage from "../customImage";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaRegHeart, FaChevronDown, FaChevronUp, FaExclamationTriangle, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaStore } from "react-icons/fa";
import { RiUser3Line } from "react-icons/ri";
import { LuShoppingCart } from "react-icons/lu";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavigationHeader from "./navigationHeader";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setHeaderHeight,
  setIsModelOpen,
  setIsMobileMenuOpen,
  setIsCartOpen,
  setFlashMessage,
} from "@/redux/slices/commonSlice";
import { Authentication } from "../DynamicComponents";
import Cookies from "js-cookie";
import { logout } from "@/redux/slices/authSlice";
import CartDrawer from "./cartDrawer";

const Header = () => {
  const headerRef = useRef();
  const pathname = usePathname();
  const isTransparentHeader = pathname === "/dd";
  const dispatch = useDispatch();

  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Clear search query on page refresh or route change
  useEffect(() => {
    setSearchQuery("");
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      setSearchQuery("");
      setIsSearchOpen(false);
      router.push(`/collection/search?query=${encodeURIComponent(q)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    collection,
    categories,
    subCategories,
    isModelOpen,
    isMobileMenuOpen,
    headerHeight,
    cart,
    wishlist,
    flashMessage,
  } = useSelector((state) => state.common);

  const cartCount = cart?.items?.length || (Array.isArray(cart) ? cart.length : 0);
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : (wishlist?.items?.length || 0);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const profileMobileRef = useRef(null);

  const searchDesktopRef = useRef(null);
  const searchMobileRef = useRef(null);
  const searchToggleRef = useRef(null);
  const searchToggleMobileRef = useRef(null);
  const searchInputDesktopRef = useRef(null);
  const searchInputMobileRef = useRef(null);

  const toggleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSearchOpen((prev) => !prev);
  };

  const [openCollectionId, setOpenCollectionId] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  // State to track which categories are showing ALL subcategories on mobile
  const [expandedCategoryIds, setExpandedCategoryIds] = useState([]);

  const hoverClassname = "text-primary cursor-pointer";

  // Flash message auto-hide effect (2.5 seconds)
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        dispatch(setFlashMessage(null));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [flashMessage, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        profileMobileRef.current &&
        !profileMobileRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideSearch = (e) => {
      const isInsideDesktop = searchDesktopRef.current && searchDesktopRef.current.contains(e.target);
      const isInsideMobile = searchMobileRef.current && searchMobileRef.current.contains(e.target);
      const isToggleDesktop = searchToggleRef.current && searchToggleRef.current.contains(e.target);
      const isToggleMobile = searchToggleMobileRef.current && searchToggleMobileRef.current.contains(e.target);

      if (!isInsideDesktop && !isInsideMobile && !isToggleDesktop && !isToggleMobile) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutsideSearch);
      document.addEventListener("touchstart", handleClickOutsideSearch);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
      document.removeEventListener("touchstart", handleClickOutsideSearch);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        if (searchInputDesktopRef.current) searchInputDesktopRef.current.focus();
        if (searchInputMobileRef.current) searchInputMobileRef.current.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      const t = setTimeout(() => {
        dispatch(setHeaderHeight(height));
      }, 0);
      return () => clearTimeout(t);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isModelOpen || isMobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [isModelOpen, isMobileMenuOpen]);

  const toggleCollection = (id) => {
    setOpenCollectionId(openCollectionId === id ? null : id);
    setOpenCategoryId(null);
  };

  const toggleCategory = (id) => {
    setOpenCategoryId(openCategoryId === id ? null : id);
  };

  const handleViewAllSubCategories = (e, catId) => {
    e.preventDefault();
    e.stopPropagation();
    if (expandedCategoryIds.includes(catId)) {
      setExpandedCategoryIds(expandedCategoryIds.filter((id) => id !== catId));
    } else {
      setExpandedCategoryIds([...expandedCategoryIds, catId]);
    }
  };

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(logout());
    setIsProfileOpen(false);
    dispatch(setFlashMessage({ type: "success", message: "Logged out successfully" }));
    router.push("/");
  };

  return (
    <>
      {/* FLASH MESSAGE BANNER (Floating banner for all screens) */}
      {flashMessage && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] sm:w-auto min-w-[300px] max-w-md px-4 py-3 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 transition-all duration-300 ${
            typeof flashMessage === "object" && flashMessage?.type === "warning"
              ? "bg-[#f59e0b] text-black border-amber-600"
              : typeof flashMessage === "object" && flashMessage?.type === "error"
              ? "bg-red-600 text-white border-red-700"
              : typeof flashMessage === "object" && flashMessage?.type === "success"
              ? "bg-emerald-600 text-white border-emerald-700"
              : "bg-[#45220e] text-white border-[#34180a]"
          }`}
        >
          <div className="flex items-center gap-3 pr-6">
            {typeof flashMessage === "object" && flashMessage?.type === "warning" ? (
              <div className="bg-black text-[#f59e0b] p-1.5 rounded-xl shrink-0">
                <FaExclamationTriangle className="w-4 h-4" />
              </div>
            ) : typeof flashMessage === "object" && flashMessage?.type === "error" ? (
              <div className="bg-white/20 text-white p-1.5 rounded-xl shrink-0">
                <FaExclamationCircle className="w-4 h-4" />
              </div>
            ) : typeof flashMessage === "object" && flashMessage?.type === "success" ? (
              <div className="bg-white/20 text-white p-1.5 rounded-xl shrink-0">
                <FaCheckCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="bg-white/20 text-white p-1.5 rounded-xl shrink-0">
                <FaInfoCircle className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs sm:text-sm font-extrabold leading-snug">
              {typeof flashMessage === "object" ? flashMessage.message : flashMessage}
            </span>
          </div>

          <button
            type="button"
            onClick={() => dispatch(setFlashMessage(null))}
            className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-black/10 transition cursor-pointer"
            aria-label="Close"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DESKTOP HEADER */}
      <header
        ref={headerRef}
        className={`hidden lg:flex w-full px-10 py-2 bg-white justify-between items-center transition-all duration-300
        ${isSticky ? "fixed top-0 left-0 right-0 z-50 shadow-md bg-white/95 border-b border-gray-100/50 backdrop-blur-md translate-y-0 transform" : isTransparentHeader ? "absolute top-0 left-0 z-10" : "relative bg-white"}`}
      >
        <Link className="cursor-pointer" href={"/"}>
          <CustomImage
            srcAttr={logo}
            altAttr={"logo"}
            titleAttr={"logo"}
            className="w-40"
          />
        </Link>

        <NavigationHeader />

        <section className="flex gap-6 items-center">
          {user?.role?.toLowerCase() !== "seller" && user?.role?.toLowerCase() !== "admin" && (
            <>
              <div className="group">
                <Link href={"/seller"} className={`${hoverClassname} text-sm lg:text-[17px]`}>
                  Become a Seller
                </Link>
                <div className="mt-1 h-[2px] w-0 bg-primary transition-all duration-300 ease-in-out group-hover:w-full"></div>
              </div>
              <div className="w-[2px] h-5 bg-primary"></div>
            </>
          )}
          <div className="flex gap-5 items-center">
            <button
              ref={searchToggleRef}
              type="button"
              suppressHydrationWarning
              onClick={toggleSearch}
              className="inline-flex items-center cursor-pointer"
              aria-label="Toggle Search Bar"
            >
              <HiMiniMagnifyingGlass className={`${hoverClassname} w-6 h-6`} />
            </button>

            <div className="relative inline-flex items-center">
              <Link href={"/wishlist"} className={hoverClassname}>
                <FaRegHeart className="w-5 h-5" />
              </Link>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs pointer-events-none">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </div>

            <div className="relative inline-flex items-center">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => dispatch(setIsCartOpen(true))}
                className={`${hoverClassname} inline-flex items-center`}
              >
                <LuShoppingCart className="w-5 h-5" />
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs pointer-events-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>

            {!isAuthenticated ? (
              <RiUser3Line
                onClick={() => dispatch(setIsModelOpen(true))}
                className={`${hoverClassname} w-5 h-5 cursor-pointer`}
              />
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2"
                >
                  <RiUser3Line className="text-primary text-xl" />

                  <FaChevronDown
                    className={`text-xs transition-all duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-11 w-48 rounded-[20px] border border-[#47230B]/20 bg-white shadow-xl overflow-hidden z-50 transition-all duration-200">
                    <div className="px-4 py-3 border-b border-light-cream">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Welcome</p>
                      <h3 className="font-bold text-primary truncate leading-tight capitalize">{user?.fullname}</h3>
                    </div>

                    <div className="p-1.5 flex flex-col gap-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-light-cream/70 hover:text-primary transition-colors"
                      >
                        Profile
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-light-cream/70 hover:text-primary transition-colors"
                      >
                        Your Orders
                      </Link>

                      {(user?.role === "admin" || user?.role === "seller") && (
                        <>
                          <Link
                            href="/add-product"
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-light-cream/70 hover:text-primary transition-colors"
                          >
                            Add Product
                          </Link>
                          <Link
                            href="/my-products"
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-light-cream/70 hover:text-primary transition-colors"
                          >
                            Your Products
                          </Link>
                        </>
                      )}

                      <div className="h-[1px] bg-light-cream/40 my-1 mx-1.5"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-red-650 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* DESKTOP SEARCH BAR */}
        <div ref={searchDesktopRef} className={`absolute left-0 right-0 z-20 border-b border-gray-200 bg-[#F8F8F8] transition-all duration-300 ease-in-out overflow-hidden shadow-sm ${isSearchOpen ? "top-full opacity-100 h-20 pointer-events-auto" : "top-0 opacity-0 h-0 pointer-events-none"}`}>
          <div className="max-w-7xl mx-auto h-full flex items-center justify-center px-6">
            <form onSubmit={handleSearchSubmit} className="w-125 max-w-full flex items-center">
              <div className="relative w-full flex items-center">
                <HiMiniMagnifyingGlass className="absolute left-3.5 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <input
                  ref={searchInputDesktopRef}
                  type="text"
                  autoComplete="off"
                  suppressHydrationWarning
                  placeholder="Search products by collection, category, subcategory, name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-700 placeholder:text-gray-400 pl-10 pr-32 py-2.5 transition focus:border-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setSearchQuery("")}
                    className="absolute right-24 p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer z-10 flex items-center justify-center"
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="absolute right-2.5 bg-black hover:bg-gray-900 text-white px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer z-10"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className={`flex lg:hidden w-full px-4 py-3 bg-white justify-between items-center border-b border-gray-100 sticky top-0 z-40 transition-all duration-300 ${isSticky ? "shadow-md bg-white/95" : ""}`}>
        <div className="flex items-center">
          {isMobileMenuOpen ? (
            <HiX
              className="w-6 h-6 cursor-pointer"
              onClick={() => dispatch(setIsMobileMenuOpen(false))}
            />
          ) : (
            <HiOutlineMenuAlt3
              className="w-6 h-6 cursor-pointer"
              onClick={() => dispatch(setIsMobileMenuOpen(true))}
            />
          )}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href={"/"}>
            <CustomImage
              srcAttr={logo}
              altAttr={"logo"}
              titleAttr={"logo"}
              className="w-28"
            />
          </Link>
        </div>

        <div className="flex gap-5 items-center">
          <button
            ref={searchToggleMobileRef}
            type="button"
            suppressHydrationWarning
            onClick={toggleSearch}
            className="inline-flex items-center cursor-pointer"
            aria-label="Toggle Search Bar"
          >
            <HiMiniMagnifyingGlass className="w-5 h-5 text-gray-700" />
          </button>

          <div className="relative inline-flex items-center">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => dispatch(setIsCartOpen(true))}
              className="inline-flex items-center cursor-pointer text-gray-700"
            >
              <LuShoppingCart className="w-5 h-5" />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs pointer-events-none">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>

          {!isAuthenticated ? (
            <RiUser3Line
              onClick={() => dispatch(setIsModelOpen(true))}
              className="w-5 h-5 text-gray-700 cursor-pointer"
            />
          ) : (
            <div className="relative" ref={profileMobileRef}>
              <button
                suppressHydrationWarning
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1 cursor-pointer"
              >
                <RiUser3Line className="w-5 h-5 text-gray-700" />
                <FaChevronDown
                  className={`text-[10px] text-gray-700 transition-all duration-300 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-9 w-48 rounded-[20px] border border-[#47230B]/20 bg-white shadow-xl overflow-hidden z-50 transition-all duration-200">
                  <div className="px-4 py-3 border-b border-light-cream">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Welcome</p>
                    <h3 className="font-bold text-primary truncate leading-tight capitalize">{user?.fullname}</h3>
                  </div>

                  <div className="p-1.5 flex flex-col gap-0.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-light-cream/70 hover:text-primary transition-colors"
                    >
                      Profile
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-light-cream/70 hover:text-primary transition-colors"
                    >
                      Your Orders
                    </Link>

                    {(user?.role === "admin" || user?.role === "seller") && (
                      <>
                        <Link
                          href="/add-product"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-light-cream/70 hover:text-primary transition-colors"
                        >
                          Add Product
                        </Link>
                        <Link
                          href="/my-products"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-light-cream/70 hover:text-primary transition-colors"
                        >
                          Your Products
                        </Link>
                      </>
                    )}

                    <div className="h-[1px] bg-light-cream/40 my-1 mx-1.5"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-red-650 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE SEARCH BAR */}
        <div ref={searchMobileRef} className={`absolute left-0 right-0 z-20 border-b border-gray-200 bg-[#F8F8F8] transition-all duration-300 ease-in-out overflow-hidden shadow-sm ${isSearchOpen ? "top-full opacity-100 h-16 pointer-events-auto" : "top-0 opacity-0 h-0 pointer-events-none"}`}>
          <div className="w-full h-full flex items-center justify-center px-4">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-125 flex items-center">
              <div className="relative w-full flex items-center">
                <HiMiniMagnifyingGlass className="absolute left-3 text-gray-400 w-3.5 h-3.5 pointer-events-none z-10" />
                <input
                  ref={searchInputMobileRef}
                  type="text"
                  autoComplete="off"
                  suppressHydrationWarning
                  placeholder="Search products by collection, category, subcategory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl outline-none text-xs text-gray-700 placeholder:text-gray-400 pl-8 pr-28 py-2 focus:border-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setSearchQuery("")}
                    className="absolute right-22 p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer z-10 flex items-center justify-center"
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <HiX className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="absolute right-2 bg-black hover:bg-gray-900 text-white px-3 py-1 rounded-md font-bold text-[11px] uppercase tracking-wider cursor-pointer z-10"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* DYNAMIC MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-white w-full h-full overflow-y-auto flex flex-col px-4 py-4 animate-in fade-in slide-in-from-left duration-200"
          style={{ top: "45px" }}
        >
          <nav className="flex flex-col gap-1 divide-y divide-gray-100">
            {Array.isArray(collection) &&
              collection.map((item) => {
                if (!item) return null;
                const dynamicCategories = Array.isArray(categories)
                  ? categories.filter(
                      (cat) =>
                        (cat.collectionName?._id || cat.collectionName) ===
                        item._id,
                    )
                  : [];

                return (
                  <div key={item._id} className="py-3">
                    <div className="flex justify-between items-center text-[15px] font-medium text-gray-800 uppercase tracking-wide">
                      {/* Collection Link */}
                      <Link
                        href={`/collection/${item.slug || ""}`}
                        onClick={() => dispatch(setIsMobileMenuOpen(false))}
                        className="hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>

                      {dynamicCategories.length > 0 && (
                        <span
                          onClick={() => toggleCollection(item._id)}
                          className="p-2 cursor-pointer"
                        >
                          {openCollectionId === item._id ? (
                            <FaChevronUp className="w-3 h-3 text-gray-500" />
                          ) : (
                            <FaChevronDown className="w-3 h-3 text-gray-500" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* LEVEL 2: CATEGORIES */}
                    {openCollectionId === item._id &&
                      dynamicCategories.length > 0 && (
                        <div className="pl-3 mt-2 flex flex-col gap-1 border-l-2 border-primary/20">
                          {dynamicCategories.map((cat) => {
                            if (!cat) return null;
                            const dynamicSubs = Array.isArray(subCategories)
                              ? subCategories.filter(
                                  (sub) =>
                                    (sub.category?._id || sub.category) ===
                                    cat._id,
                                )
                              : [];

                            const isExpanded = Array.isArray(
                              expandedCategoryIds,
                            )
                              ? expandedCategoryIds.includes(cat._id)
                              : false;
                            // Filter logic: Pehle 5 dikhao, view all click hone par sabhi dikhao
                            const visibleSubs = isExpanded
                              ? dynamicSubs
                              : dynamicSubs.slice(0, 5);

                            return (
                              <div key={cat._id} className="py-2">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                  <Link
                                    href={`/collection/${item.slug || ""}/${cat.slug || ""}`}
                                    onClick={() =>
                                      dispatch(setIsMobileMenuOpen(false))
                                    }
                                    className="hover:text-primary"
                                  >
                                    {cat.name}
                                  </Link>
                                  {dynamicSubs.length > 0 && (
                                    <span
                                      onClick={() => toggleCategory(cat._id)}
                                      className="p-2 cursor-pointer"
                                    >
                                      {openCategoryId === cat._id ? (
                                        <FaChevronUp className="w-2.5 h-2.5 text-gray-400" />
                                      ) : (
                                        <FaChevronDown className="w-2.5 h-2.5 text-gray-400" />
                                      )}
                                    </span>
                                  )}
                                </div>

                                {/* LEVEL 3: SUB-CATEGORIES */}
                                {openCategoryId === cat._id &&
                                  dynamicSubs.length > 0 && (
                                    <div className="pl-4 mt-2 text-xs text-gray-500 space-y-2.5 bg-gray-50/70 p-2 rounded">
                                      {dynamicSubs.length > 5 && (
                                        <button
                                          onClick={(e) =>
                                            handleViewAllSubCategories(
                                              e,
                                              cat._id,
                                            )
                                          }
                                          className="text-amber-700 underline font-semibold block text-left"
                                        >
                                          {isExpanded
                                            ? "Show Less"
                                            : "View All"}
                                        </button>
                                      )}

                                      <ul className="space-y-2 pl-0.5">
                                        {visibleSubs.map((sub) => {
                                          if (!sub) return null;
                                          return (
                                            <li key={sub._id}>
                                              <Link
                                                href={`/collection/${item.slug || ""}/${cat.slug || ""}/${sub.slug || ""}`}
                                                className="hover:text-primary text-gray-600 block py-0.5"
                                                onClick={() =>
                                                  dispatch(
                                                    setIsMobileMenuOpen(false),
                                                  )
                                                }
                                              >
                                                {sub.name}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                );
              })}

            {/* WISHLIST (Without icon, at the end of collections list) */}
            <div className="py-3">
              <div className="flex justify-between items-center text-[15px] font-medium text-gray-800 uppercase tracking-wide">
                <Link
                  href="/wishlist"
                  onClick={() => dispatch(setIsMobileMenuOpen(false))}
                  className="hover:text-primary transition-colors"
                >
                  Wishlist
                </Link>
                {wishlistCount > 0 && (
                  <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </div>

            {/* BECOME A SELLER (Below Wishlist at the bottom) */}
            {user?.role?.toLowerCase() !== "seller" && user?.role?.toLowerCase() !== "admin" && (
              <div className="py-3">
                <div className="flex justify-between items-center text-[15px] font-medium text-gray-800 uppercase tracking-wide">
                  <Link
                    href="/seller"
                    onClick={() => dispatch(setIsMobileMenuOpen(false))}
                    className="hover:text-primary transition-colors"
                  >
                    Become a Seller
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* GLOBAL AUTH MODAL */}
      {isModelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => dispatch(setIsModelOpen(false))}
        >
          <div
            className="w-full max-w-[450px] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Authentication onClose={() => dispatch(setIsModelOpen(false))} />
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      <CartDrawer />
    </>
  );
};

export default Header;
