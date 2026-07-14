"use client";

import React, { useEffect } from "react";
import { store } from "@/redux/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "@/redux/action/authAction";

// Sub-component to handle the user check hook logic inside the context provider bounds
function AuthHydrator({ children }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Hits your backend route `/user/me` right on app startup or refresh
    dispatch(getLoggedInUser());
  }, [dispatch]);

  // Optional: Shows a simple full-screen loading state until the backend response finishes
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#fff]">
        <div className="flex flex-col items-center gap-2">
          {/* You can replace this text with a clean UI loading spinner */}
          <p className="text-lg font-medium text-gray-600 animate-pulse">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}