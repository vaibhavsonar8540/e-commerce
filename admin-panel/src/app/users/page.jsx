"use client";

import Link from "next/link";
import { ChevronDown, Search, Undo2 } from "lucide-react";

const users = [
  {
    id: 1,
    fullname: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    role: "user",
  },
  {
    id: 2,
    fullname: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    role: "user",
  },
  {
    id: 3,
    fullname: "Robert Johnson",
    email: "robert@example.com",
    phone: "9876543212",
    role: "user",
  },
  {
    id: 4,
    fullname: "Emily Brown",
    email: "emily@example.com",
    phone: "9876543213",
    role: "user",
  },
  {
    id: 5,
    fullname: "David Wilson",
    email: "david@example.com",
    phone: "9876543214",
    role: "user",
  },
];

export default function User() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
        >
          <Undo2 size={20} />
        </Link>

        <h1 className="text-3xl font-bold uppercase">Users</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-wrap gap-4 items-center mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search user..."
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-gray-400"
          />
        </div>

        {/* Date */}
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-4 py-3"
        />

        {/* Sort */}
        <div className="relative w-32">
          <select className="w-full appearance-none border border-gray-300 rounded-lg px-4 pr-10 py-3 bg-white outline-none">
            <option>ASC</option>
            <option>DESC</option>
          </select>
          <ChevronDown
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-sm h-[600px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="text-left">
              <th className="p-4 w-20">#</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-t border-t-gray-300">
                <td className="p-4 text-mid-grey">{index + 1}</td>
                <td className="p-4 font-medium text-mid-grey">
                  {user.fullname}
                </td>
                <td className="p-4 text-mid-grey">{user.email}</td>
                <td className="p-4 text-mid-grey">{user.phone}</td>
                <td className="p-4 text-mid-grey capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}