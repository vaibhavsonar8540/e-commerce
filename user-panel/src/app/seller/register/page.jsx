"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/utils/axiosInstant";
import { updateUser } from "@/redux/slices/authSlice";
import { setIsModelOpen } from "@/redux/slices/commonSlice";
import { toast } from "react-toastify";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, Building, MapPin, BadgePercent } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SellerRegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1: OTP verification, 2: Form submission
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pre-fill email when user state becomes available
  useEffect(() => {
    if (user?.email) {
      setEmailInput(user.email);
    }
  }, [user]);

  const handleSendOtp = async () => {
    if (!emailInput) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/user/send-seller-otp", { email: emailInput });
      if (res.data.success) {
        toast.success(res.data.message || "OTP Sent successfully!");
        setOtpSent(true);
        // During local testing/debug, print OTP in alert if present
        if (res.data.otp) {
          console.log("TESTING OTP:", res.data.otp);
          toast.info(`Development Mock OTP: ${res.data.otp}`, { autoClose: 10000 });
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput) {
      toast.error("Please enter the verification code.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/user/verify-seller-otp", { email: emailInput, otp: otpInput });
      if (res.data.success) {
        toast.success("Email verified successfully!");
        formik.setFieldValue("email", emailInput);
        setStep(2);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Formik for Step 2 Business onboarding
  const formik = useFormik({
    initialValues: {
      fullname: user?.fullname || "",
      email: user?.email || emailInput || "",
      phone: user?.phone || "",
      businessName: "",
      gstin: "",
      address: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      businessName: Yup.string()
        .min(2, "Shop name must be at least 2 characters")
        .optional(),
      gstin: Yup.string()
        .optional(),
      address: Yup.string()
        .optional(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await api.post("/user/register-seller", {
          email: values.email || emailInput,
          businessName: values.businessName,
          gstin: values.gstin,
          address: values.address,
        });

        if (res.data.success) {
          toast.success("Seller account setup complete!");
          // Update Redux state
          dispatch(updateUser(res.data.user));
          router.push("/add-product"); // Redirect to add product portal helper
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
        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-650 mb-5 shadow-inner animate-pulse">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-playfair">
          Sign In Required
        </h2>
        <p className="mt-2 text-sm text-gray-550 max-w-sm">
          Please log in to your account first. Onboarding integrates with your login identity.
        </p>
        <button
          onClick={() => dispatch(setIsModelOpen(true))}
          className="mt-6 px-6 py-3 bg-purple-750 hover:bg-purple-850 text-white font-bold rounded-xl transition duration-200 text-sm shadow-md cursor-pointer animate-fade-in"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/40 py-12 px-4 sm:px-8 lg:px-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 relative overflow-hidden animate-fade-in">
        
        {/* Step Banner Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 font-playfair tracking-tight">
              Supplier Onboarding
            </h1>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              {step === 1 ? "Step 1: Identity Verification" : "Step 2: Business Registry"}
            </p>
          </div>
          <div className="flex gap-1">
            <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? "bg-[#FF6B35]" : "bg-gray-250"}`} />
            <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? "bg-[#FF6B35]" : "bg-gray-250"}`} />
          </div>
        </div>

        {/* Step 1: Verification Flow */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl flex gap-3 text-purple-900">
              <Mail className="shrink-0 text-purple-650" size={20} />
              <div className="text-xs leading-relaxed">
                <span className="font-bold">Email Address Authentication:</span> We will send a 6-digit confirmation key to verify that the store email matches the account container.
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Account Registered Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  disabled={!!user?.email}
                  placeholder="Enter email address"
                  className="w-full py-3.5 px-4 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm text-gray-800 bg-gray-50/30 disabled:bg-gray-100/50 disabled:cursor-not-allowed"
                />
              </div>

              {otpSent && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Confirmation Key (OTP)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full py-3.5 px-4 border border-gray-200 rounded-xl outline-none focus:border-black transition text-sm text-gray-800 tracking-widest font-mono text-center bg-gray-50/30"
                  />
                  <p className="text-[10px] text-gray-400 font-semibold italic">
                    If email is not received, check spam folders or check terminal/service output console logs.
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full py-3.5 bg-black hover:bg-gray-900 text-white font-extrabold rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Verification OTP"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="w-full py-3.5 bg-[#FF6B35] hover:bg-[#e05624] text-white font-extrabold rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify OTP & Continue"}
                    </button>
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full py-3.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-bold rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Form Onboarding */}
        {step === 2 && (
          <form onSubmit={formik.handleSubmit} className="space-y-6 animate-fade-in">
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
                  className="w-full py-3 px-4 border border-gray-150 rounded-xl bg-gray-100/50 text-sm text-gray-505 outline-none cursor-not-allowed"
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
                  className="w-full py-3 px-4 border border-gray-150 rounded-xl bg-gray-100/50 text-sm text-gray-550 outline-none cursor-not-allowed"
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
                  className={`w-full py-3.5 px-4 pl-10 border rounded-xl outline-none focus:border-black transition text-sm text-gray-800 bg-gray-50/20 ${
                    formik.touched.businessName && formik.errors.businessName ? "border-red-400" : "border-gray-200"
                  }`}
                />
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              {formik.touched.businessName && formik.errors.businessName && (
                <p className="text-xs text-red-500 font-semibold">{formik.errors.businessName}</p>
              )}
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
                  className={`w-full py-3.5 px-4 pl-10 border rounded-xl outline-none focus:border-black transition text-sm text-gray-800 bg-gray-50/20 ${
                    formik.touched.gstin && formik.errors.gstin ? "border-red-400" : "border-gray-200"
                  }`}
                />
                <BadgePercent className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              {formik.touched.gstin && formik.errors.gstin && (
                <p className="text-xs text-red-500 font-semibold">{formik.errors.gstin}</p>
              )}
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
                  placeholder="Full store street mapping with city and pincode..."
                  className={`w-full py-3 px-4 pl-10 border rounded-xl outline-none focus:border-black transition text-sm text-gray-800 bg-gray-50/20 ${
                    formik.touched.address && formik.errors.address ? "border-red-400" : "border-gray-200"
                  }`}
                />
                <MapPin className="absolute left-3.5 top-4 text-gray-400 w-4 h-4" />
              </div>
              {formik.touched.address && formik.errors.address && (
                <p className="text-xs text-red-500 font-semibold">{formik.errors.address}</p>
              )}
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3.5 px-5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-bold rounded-xl transition text-sm cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="grow py-3.5 bg-black hover:bg-gray-900 text-white font-extrabold rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? "Saving Portal..." : "Register & Complete Onboarding"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
