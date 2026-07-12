import Link from "next/link";
import {
  Users,
  Store,
  Layers3,
  Grid2X2,
  ListTree,
} from "lucide-react";

const stats = [
  {
    title: "Sellers",
    count: 120,
    href: "/sellers",
    icon: Store,
    bg: "bg-blue-100",
    iconBg: "bg-blue-500",
    text: "text-blue-700",
  },
  {
    title: "Users",
    count: 2450,
    href: "/users",
    icon: Users,
    bg: "bg-purple-100",
    iconBg: "bg-purple-500",
    text: "text-purple-700",
  },
  {
    title: "Collections",
    count: 18,
    href: "/collections",
    icon: Layers3,
    bg: "bg-yellow-100",
    iconBg: "bg-yellow-500",
    text: "text-yellow-700",
  },
  {
    title: "Categories",
    count: 52,
    href: "/categories",
    icon: Grid2X2,
    bg: "bg-green-100",
    iconBg: "bg-green-500",
    text: "text-green-700",
  },
  {
    title: "Sub Categories",
    count: 167,
    href: "/subcategories",
    icon: ListTree,
    bg: "bg-red-100",
    iconBg: "bg-red-500",
    text: "text-red-700",
  },
];

export default function Dashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-10">
        Hi, Welcome back 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} href={item.href}>
              <div
                className={`${item.bg} rounded-3xl p-6 shadow-sm cursor-pointer h-56`}
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`${item.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-white`}
                  >
                    <Icon size={28} />
                  </div>

                  <span className={`font-semibold ${item.text}`}>
                    {item.count}
                  </span>
                </div>

                <div className="mt-12">
                  <p className="text-lg text-gray-700 font-medium">
                    {item.title}
                  </p>

                  <h2 className={`text-4xl font-bold mt-2 ${item.text}`}>
                    {item.count}
                  </h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}