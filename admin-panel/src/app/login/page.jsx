"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstant";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // बैकएंड को डेटा भेजना
      const res = await api.post("/user/login", { email, password });
      
      if (res.data) {
        // Redux store में केवल सक्सेसफुल एडमिन डेटा सेव होगा
        dispatch(loginSuccess({
          user: res.data.user,
          token: res.data.token
        }));

        // एडमिन डैशबोर्ड पर रीडायरेक्ट करें
        router.push("/dashboard");
      }
    } catch (err) {
      // बैकएंड से आने वाला 403 (Access Denied) या 401 एरर यहाँ कैप्चर होगा
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 uppercase">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with your admin credentials
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black transition-all"
                placeholder="Enter admin email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 shadow-md transition-colors disabled:bg-gray-400"
            >
              {loading ? "Verifying Admin..." : "Secure Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;