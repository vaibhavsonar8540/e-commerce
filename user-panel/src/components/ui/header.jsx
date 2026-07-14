"use client";

import logo from "@/../public/images/logo.png";
import CustomImage from "../customImage";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaRegHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";
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
} from "@/redux/slices/commonSlice";
import { Authentication } from "../DynamicComponents";
import Cookies from "js-cookie";
import { logout } from "@/redux/slices/authSlice";

const Header = () => {
  const headerRef = useRef();
  const pathname = usePathname();
  const isTransparentHeader = pathname === "/dd";
  const dispatch = useDispatch();

  const {
    collection,
    categories,
    subCategories,
    isModelOpen,
    isMobileMenuOpen,
    headerHeight,
  } = useSelector((state) => state.common);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [openCollectionId, setOpenCollectionId] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  // State to track which categories are showing ALL subcategories on mobile
  const [expandedCategoryIds, setExpandedCategoryIds] = useState([]);

  const hoverClassname = "text-primary cursor-pointer";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      dispatch(setHeaderHeight(headerRef.current.offsetHeight));
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

    toast.success("Logged out successfully");

    router.push("/");
  };

  return (
    <>
      {/* DESKTOP HEADER */}
      <header
        ref={headerRef}
        className={`hidden lg:flex w-full px-10 py-2 bg-white justify-between items-center transition-all duration-300
        ${isTransparentHeader ? "absolute top-0 left-0 z-10" : "relative bg-white"}`}
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
          <div className="group">
            <h2 className={`${hoverClassname} text-sm lg:text-[17px]`}>
              Become a Seller
            </h2>
            <div className="mt-1 h-[2px] w-0 bg-primary transition-all duration-300 ease-in-out group-hover:w-full"></div>
          </div>
          <div className="w-[2px] h-5 bg-primary"></div>
          <div className="flex gap-4 items-center">
            <HiMiniMagnifyingGlass className={`${hoverClassname} w-full h-6`} />

            <FaRegHeart className={`${hoverClassname} w-full h-5`} />

            <LuShoppingCart className={`${hoverClassname} w-full h-5`} />

            {!isAuthenticated ? (
              <RiUser3Line
                onClick={() => dispatch(setIsModelOpen(true))}
                className={`${hoverClassname} w-full h-5 cursor-pointer`}
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
                  <div className="absolute right-0 top-10 w-48 rounded-xl border bg-white shadow-md overflow-hidden z-50">
                    <div className="px-4 pt-3">
                      <h3 className="font-semibold">{user?.fullname}</h3>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 pt-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 pt-2 hover:bg-gray-100"
                    >
                      Your Orders
                    </Link>

                    {(user?.role === "admin" || user?.role === "seller") && (
                      <Link
                        href="/seller/add-product"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100"
                      >
                        Add Product
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </header>

      {/* MOBILE HEADER */}
      <header className="flex lg:hidden w-full px-4 py-3 bg-white justify-between items-center border-b border-gray-100 sticky top-0 z-40">
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

        <div className="flex gap-4 items-center">
          <HiMiniMagnifyingGlass className="w-5 h-5 text-gray-700 cursor-pointer" />
          <RiUser3Line
            onClick={() => dispatch(setIsModelOpen(true))}
            className="w-5 h-5 text-gray-700 cursor-pointer"
          />
          <LuShoppingCart className="w-5 h-5 text-gray-700 cursor-pointer" />
        </div>
      </header>

      {/* DYNAMIC MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-white w-full h-full overflow-y-auto flex flex-col px-4 py-4 animate-in fade-in slide-in-from-left duration-200"
          style={{ top: headerHeight ? `${headerHeight}px` : "53px" }}
        >
          <nav className="flex flex-col gap-1 divide-y divide-gray-100">
            {collection.map((item) => {
              const dynamicCategories = categories.filter(
                (cat) => cat.collectionName?._id === item._id,
              );

              return (
                <div key={item._id} className="py-3">
                  <div className="flex justify-between items-center text-[15px] font-medium text-gray-800 uppercase tracking-wide">
                    {/* Collection Link */}
                    <Link
                      href={`/collection/${item.slug}`}
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
                          const dynamicSubs = subCategories.filter(
                            (sub) => sub.category?._id === cat._id,
                          );

                          const isExpanded = expandedCategoryIds.includes(
                            cat._id,
                          );
                          // Filter logic: Pehle 5 dikhao, view all click hone par sabhi dikhao
                          const visibleSubs = isExpanded
                            ? dynamicSubs
                            : dynamicSubs.slice(0, 5);

                          return (
                            <div key={cat._id} className="py-2">
                              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                <Link
                                  href={`/collection/${item.slug}/${cat.slug}`}
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
                                          handleViewAllSubCategories(e, cat._id)
                                        }
                                        className="text-amber-700 underline font-semibold block text-left"
                                      >
                                        {isExpanded ? "Show Less" : "View All"}
                                      </button>
                                    )}

                                    <ul className="space-y-2 pl-0.5">
                                      {visibleSubs.map((sub) => (
                                        <li key={sub._id}>
                                          <Link
                                            href={`/collection/${item.slug}/${cat.slug}/${sub.slug}`}
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
                                      ))}
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
          </nav>
        </div>
      )}

      {/* GLOBAL AUTH MODAL */}
      {isModelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm"
          onClick={() => dispatch(setIsModelOpen(false))}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Authentication onClose={() => dispatch(setIsModelOpen(false))} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
