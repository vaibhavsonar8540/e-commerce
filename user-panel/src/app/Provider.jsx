"use client";

import React, { useEffect } from "react";
import { store } from "@/redux/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "@/redux/action/authAction";

function AuthHydrator({ children }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#fff]">
        {/* Tailwind-based CSS Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
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