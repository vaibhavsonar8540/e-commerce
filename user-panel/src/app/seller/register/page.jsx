"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/utils/axiosInstant";
import { updateUser } from "@/redux/slices/authSlice";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import { toast } from "react-toastify";
import { Building, MapPin, BadgePercent, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SellerRegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullname: user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      businessName: "",
      gstin: "",
      address: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      businessName: Yup.string().optional(),
      gstin: Yup.string().optional(),
      address: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await api.post("/user/register-seller", {
          email: values.email || user?.email,
          businessName: values.businessName,
          gstin: values.gstin,
          address: values.address,
        });

        if (res.data.success) {
          toast.success("Seller account setup complete!");
          dispatch(updateUser(res.data.user));
          router.push("/add-product");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to submit business details.");
      } finally {
        setLoading(false);
      }
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-5 shadow-inner">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-playfair">
          Sign In Required
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Please log in to your account first to complete seller onboarding.
        </p>
        <button
          onClick={() => dispatch(setIsModelOpen(true))}
          className="mt-6 px-6 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition duration-200 text-sm shadow-md cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/40 py-12 px-4 sm:px-8 lg:px-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 font-playfair tracking-tight">
              Supplier Onboarding
            </h1>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Register Your Business
            </p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Contact Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formik.values.fullname}
                disabled
                className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-100/50 text-sm text-gray-600 outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Contact Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formik.values.phone}
                disabled
                className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-100/50 text-sm text-gray-600 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Shop / Store Name (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                name="businessName"
                value={formik.values.businessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="E.g. Zara Boutique"
                className="w-full py-3.5 px-4 pl-10 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm text-gray-800 bg-gray-50/20"
              />
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Business GSTIN (15-Digit Tax Number)
            </label>
            <div className="relative">
              <input
                type="text"
                name="gstin"
                value={formik.values.gstin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="E.g. 22AAAAA0000A1Z5"
                className="w-full py-3.5 px-4 pl-10 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm text-gray-800 bg-gray-50/20"
              />
              <BadgePercent className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Registered Store Address
            </label>
            <div className="relative">
              <textarea
                name="address"
                rows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Full store street address with city and pincode..."
                className="w-full py-3 px-4 pl-10 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm text-gray-800 bg-gray-50/20"
              />
              <MapPin className="absolute left-3.5 top-4 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black hover:bg-gray-900 text-white font-extrabold rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving Portal..." : "Register & Complete Onboarding"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
