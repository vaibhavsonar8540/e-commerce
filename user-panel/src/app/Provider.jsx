"use client";

import React, { useEffect } from "react";
import { store } from "@/redux/store";
import { Provider, useDispatch } from "react-redux";
import { getLoggedInUser } from "@/redux/action/authAction";

function AuthHydrator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}