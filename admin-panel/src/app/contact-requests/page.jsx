"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, Undo2, Loader2, Calendar, Mail, MessageSquare, User, Tag, Clock } from "lucide-react";
import api from "@/utils/axiosInstant";

export default function ContactRequests() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [filterDate, setFilterDate] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/contact");
        if (response.data && response.data.data) {
          setContacts(response.data.data);
        } else if (response.data && Array.isArray(response.data.contacts)) {
          setContacts(response.data.contacts);
        } else {
          setContacts([]);
        }
      } catch (err) {
        console.error("Error fetching contact requests:", err);
        setError(err.response?.data?.message || "Failed to load contact requests");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter((contact) => {
      // 1. Search Query Filter (name, email, subject, message)
      const matchSearch =
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Date Filter
      let matchDate = true;
      if (filterDate && contact.createdAt) {
        const contactDate = new Date(contact.createdAt).toISOString().split("T")[0];
        matchDate = contactDate === filterDate;
      }

      return matchSearch && matchDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      if (sortOrder === "NEWEST") {
        return dateB - dateA;
      } else if (sortOrder === "OLDEST") {
        return dateA - dateB;
      } else if (sortOrder === "NAME_ASC") {
        return (a.name || "").localeCompare(b.name || "");
      } else {
        return (b.name || "").localeCompare(a.name || "");
      }
    });

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md border border-gray-200 transition-all"
          >
            <Undo2 size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase text-gray-800 tracking-tight">
              Contact Requests
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              View and respond to inquiries from website visitors
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-semibold text-gray-700">
          <MessageSquare size={18} className="text-black" />
          <span>Total Requests: {contacts.length}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-stretch md:items-center mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, subject or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50 focus:bg-white text-sm"
          />
        </div>

        {/* Date and Sort Selectors */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white min-w-[150px]"
          />

          <div className="relative min-w-[150px]">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full appearance-none border border-gray-300 rounded-lg px-4 pr-10 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer text-sm text-gray-700 font-medium"
            >
              <option value="NEWEST">Date: Newest First</option>
              <option value="OLDEST">Date: Oldest First</option>
              <option value="NAME_ASC">Name: A-Z</option>
              <option value="NAME_DESC">Name: Z-A</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
          <p className="text-gray-500 font-medium text-sm">Loading contact requests...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4 font-bold text-lg">
            !
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Failed to fetch contacts</h3>
          <p className="text-gray-500 max-w-md text-sm">{error}</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg mb-1">No contact requests found</h3>
          <p className="text-gray-500 max-w-sm text-sm">
            {searchQuery || filterDate
              ? "Try adjusting filters or search phrase."
              : "No customer inquiries have been submitted yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredContacts.map((contact, index) => (
              <div
                key={contact._id || index}
                onClick={() => setSelectedContact(contact)}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-800 truncate max-w-[180px]">
                      {contact.name}
                    </span>
                  </div>
                  {contact.createdAt && (
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
                    <Tag size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{contact.subject}</span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-2">
                    {contact.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 w-16 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Message</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact, index) => (
                    <tr
                      key={contact._id || index}
                      onClick={() => setSelectedContact(contact)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <td className="p-4 text-center text-xs font-semibold text-gray-500">{index + 1}</td>
                      <td className="p-4 text-sm font-semibold text-gray-800 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 font-bold text-xs">
                            {contact.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span>{contact.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{contact.email}</td>
                      <td className="p-4 text-sm font-medium text-gray-800 max-w-[200px] truncate">{contact.subject}</td>
                      <td className="p-4 text-sm text-gray-500 max-w-[320px] truncate">{contact.message}</td>
                      <td className="p-4 text-xs text-gray-500 whitespace-nowrap font-mono">
                        {contact.createdAt
                          ? new Date(contact.createdAt).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-xs sm:text-sm text-gray-500 text-right font-medium">
            Showing {filteredContacts.length} of {contacts.length} contact requests
          </div>
        </>
      )}

      {/* Modal Popup for Contact Details */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative border border-gray-100">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Inquiry Details
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-2 font-playfair">{selectedContact.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <User size={18} className="text-gray-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">From</span>
                  <span className="font-semibold text-gray-800">{selectedContact.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Mail size={18} className="text-gray-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Email Address</span>
                  <a href={`mailto:${selectedContact.email}`} className="font-semibold text-blue-600 hover:underline break-all">
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Clock size={18} className="text-gray-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Submitted On</span>
                  <span className="font-medium text-gray-700 font-mono">
                    {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider mb-1">Message</span>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-sans text-sm">
                  {selectedContact.message}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                className="bg-black text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
              >
                <Mail size={16} />
                Reply via Email
              </a>
              <button
                onClick={() => setSelectedContact(null)}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
