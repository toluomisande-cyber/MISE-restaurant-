"use client";

import React from "react";
import { CampusProvider } from "@/context/CampusContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <CampusProvider>
      {children}
      <CartDrawer />
    </CampusProvider>
  );
};
