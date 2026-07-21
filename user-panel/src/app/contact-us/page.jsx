"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Send, HelpCircle, ArrowLeft } from "lucide-react";
import api from "@/utils/axiosInstant";
import { toast } from "react-toastify";
import { contactEmail, contactPhone } from "@/utils/environment";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    // validation
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all the fields.");
      return;
    }

    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters long.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/contact", {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      if (response.data?.success) {
        toast.success(response.data.message || "Message submitted successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(response.data?.message || "Something went wrong. Please check your data.");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to submit message. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-300">
        
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#45220e] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="border-b border-gray-200 pb-6 text-center sm:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#45220e] tracking-tight font-playfair capitalize">
            Contact Customer Care
          </h1>
          <p className="text-sm text-gray-400">
            Have questions about orders, payments, collections, or returns? Drop us a line below.
          </p>
        </div>

        {/* Multi-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Support Information (Flat Layout - No Card / Border / Shadow) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
                Customer Support
              </h3>
              
              <div className="space-y-4 text-sm font-semibold text-gray-600">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f9ece5] text-[#45220e] flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs text-gray-400 uppercase tracking-widest">Email Channels</h5>
                    <p className="mt-1 leading-relaxed">{contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Answer Box */}
            <div className="bg-[#f9ece5]/15 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#45220e]">
                <HelpCircle size={18} />
                <h4 className="font-bold text-sm uppercase tracking-wide">Fulfillment Window</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our support desk is operated Monday - Saturday, 9 AM - 6 PM IST. Order pick-ups and logistics tickets proceed normally during holidays.
              </p>
            </div>
          </div>

          {/* Contact Input Form (Flat Layout - No Card / Border / Shadow) */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full text-sm font-medium border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#45220e] focus:ring-1 focus:ring-[#45220e] transition-all bg-gray-50/30"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full text-sm font-medium border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#45220e] focus:ring-1 focus:ring-[#45220e] transition-all bg-gray-50/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Query Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Order Delivery Issue, Seller Account Creation"
                  className="w-full text-sm font-medium border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#45220e] focus:ring-1 focus:ring-[#45220e] transition-all bg-gray-50/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Message Content
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us details about your query..."
                  className="w-full text-sm font-medium border border-gray-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-[#45220e] focus:ring-1 focus:ring-[#45220e] transition-all bg-gray-50/30 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#45220e] hover:bg-[#34180a] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
