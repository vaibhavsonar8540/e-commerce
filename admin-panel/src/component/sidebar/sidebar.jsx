"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../public/images/logo.png"
import userPfp from "../../../public/images/user.png"
import {
  LayoutDashboard,
  MessageSquare,
  Store,
  Layers3,
  Grid2x2,
  ListTree,
  Ticket,
  LogOut,
} from "lucide-react";
import CustomImage from "../customImage";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import api from "@/utils/axiosInstant";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Contact Requests",
    href: "/contact-requests",
    icon: MessageSquare,
  },
  {
    name: "Sellers",
    href: "/sellers",
    icon: Store,
  },
  {
    name: "Collection",
    href: "/Navigations/collection",
    icon: Layers3,
  },
  {
    name: "Category",
    href: "/Navigations/category",
    icon: Grid2x2,
  },
  {
    name: "Sub Category",
    href: "/Navigations/sub-category",
    icon: ListTree,
  },
  {
    name: "Coupon Code",
    href: "/Navigations/coupon-code",
    icon: Ticket,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  return (
    <aside className="w-72 h-screen bg-white flex flex-col border-r border-gray-200">

      {/* Logo */}

      <div className="h-24 flex items-center justify-center">
        <CustomImage srcAttr={logo} className="w-40" altAttr={"logo"} titleAttr={"logo"}/>
      </div>

      {/* Profile */}

      <div className="m-5 rounded-2xl bg-gray-100 p-4 flex items-center gap-3">
        <div className="rounded-full">
          <CustomImage srcAttr={userPfp} altAttr={"userPfp"} titleAttr={"userPfp"} className="w-10 p-1"/>
        </div>

        <div>
          <h1 className="font-semibold text-black font-playfair">
            Admin
          </h1>

          <p className="text-sm text-gray-500">
            {user?.fullname || "Administrator"}
          </p>
        </div>
      </div>

      {/* Menu */}

      <div className="px-4 flex-1 overflow-y-auto">

        {menu.map((item) => {
          const Icon = item.icon || LayoutDashboard;

          const active = pathname === item.href || (item.href === "/dashboard" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-2 transition font-medium text-sm
              ${
                active
                  ? "bg-black text-white shadow-sm"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout */}

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50 font-medium text-sm transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;