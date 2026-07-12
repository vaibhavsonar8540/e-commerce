"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../public/images/logo.png"
import userPfp from "../../../public/images/user.png"
import {
  LayoutDashboard,
  Users,
  Store,
  Layers3,
  Grid2x2,
  ListTree,
  LogOut,
} from "lucide-react";
import CustomImage from "../customImage";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { logoutUser } from "@/service/common.service";

const menu = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
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
];

const Sidebar = () => {
  const pathname = usePathname();

  const {user} = useSelector((state) => state.auth)

  return (
    <aside className="w-72 h-screen bg-white flex flex-col">

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
            {user?.fullname}
          </p>
        </div>
      </div>

      {/* Menu */}

      <div className="px-4">

        {menu.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-2 transition
              ${
                active
                  ? "bg-primary bg-opacity-60 text-white"
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

      <div className="p-4">
        <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;