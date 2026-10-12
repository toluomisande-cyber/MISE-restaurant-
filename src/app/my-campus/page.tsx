"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FoodCard } from "@/components/food/FoodCard";
import { VendorCard } from "@/components/vendor/VendorCard";
import {
  ArrowRight,
  Building2,
  Heart,
  History,
  MapPin,
  Package,
  Sparkles,
  Ticket,
} from "lucide-react";
import Link from "next/link";

export default function MyCampusDashboard() {
  const {
    selectedInstitution,
    orders,
    savedVendorIds,
    savedMealIds,
    vendors,
    menuItems,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<"orders" | "favorites" | "history">("orders");

  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  );
  const pastOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "cancelled"
  );

  const favoriteVendors = vendors.filter((v) => savedVendorIds.includes(v.id));
  const favoriteMeals = menuItems.filter((m) => savedMealIds.includes(m.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Profile / Campus Header */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[#E2DDD2] bg-[#FFFFFF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#24251F] text-[#D7E7A5] font-serif font-black text-2xl flex items-center justify-center shrink-0">
              TB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-2xl text-[#24251F]">
                  Tunde Bakare
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D7E7A5] text-[#24251F]">
                  Student Account
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B6D5E] mt-1">
                <Building2 className="w-3.5 h-3.5 text-[#A84C35]" />
                <span>{selectedInstitution.name}</span>
                <span>•</span>
                <span>Tedder Hall Quadrangle</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ai-finder"
              className="px-4 py-2.5 rounded-xl bg-[#F6F3EC] border border-[#E2DDD2] hover:border-[#A84C35] text-xs font-bold text-[#24251F] transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A84C35]" />
              <span>Ask AI Food Finder</span>
            </Link>
            <Link
              href="/discover"
              className="px-4 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-bold hover:bg-black transition"
            >
              Order Food
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E2DDD2] gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === "orders"
                ? "border-[#A84C35] text-[#A84C35]"
                : "border-transparent text-[#6B6D5E] hover:text-[#24251F]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Active Orders ({activeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === "favorites"
                ? "border-[#A84C35] text-[#A84C35]"
                : "border-transparent text-[#6B6D5E] hover:text-[#24251F]"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favorites ({favoriteMeals.length + favoriteVendors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === "history"
                ? "border-[#A84C35] text-[#A84C35]"
                : "border-transparent text-[#6B6D5E] hover:text-[#24251F]"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Order History ({pastOrders.length})</span>
          </button>
        </div>

        {/* Tab 1: Active Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              <div className="p-12 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] text-center space-y-3">
                <Ticket className="w-10 h-10 mx-auto text-[#6B6D5E] opacity-40" />
                <h3 className="font-serif font-bold text-lg text-[#24251F]">
                  No active orders in preparation
                </h3>
                <p className="text-xs text-[#6B6D5E] max-w-sm mx-auto">
                  When you order meals for pickup or hall delivery, you&apos;ll see real-time updates and pickup tokens right here.
                </p>
                <Link
                  href="/discover"
                  className="inline-block px-4 py-2 rounded-xl bg-[#24251F] text-white text-xs font-semibold hover:bg-black transition"
                >
                  Browse Campus Cafeterias
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-[#24251F] text-[#D7E7A5] font-mono font-bold text-sm">
                          Token: {ord.tokenCode}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#FDF3F0] text-[#A84C35] font-bold text-xs uppercase tracking-wider">
                          Status: {ord.status.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-[#6B6D5E]">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#24251F]">
                          {ord.vendorName}
                        </h3>
                        <div className="text-xs text-[#6B6D5E] flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#A84C35]" />
                          <span>{ord.campusAreaName}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="text-xs text-[#24251F] space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="font-medium">
                            {it.quantity}x {it.name} — ₦{it.itemTotal.toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#E2DDD2]">
                      <div className="md:text-right">
                        <div className="text-xs text-[#6B6D5E]">Total Order Amount</div>
                        <div className="font-bold text-xl text-[#24251F]">
                          ₦{ord.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-[#3E5A17] font-semibold mt-0.5">
                          {ord.paymentMethod.replace(/_/g, " ")}
                        </div>
                      </div>

                      <Link
                        href={`/orders/${ord.id}`}
                        className="px-5 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-bold hover:bg-black transition flex items-center gap-1.5 justify-center shadow-xs"
                      >
                        <span>View Live Tracker</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Favorites */}
        {activeTab === "favorites" && (
          <div className="space-y-8">
            {/* Favorite Meals */}
            <div>
              <h3 className="font-serif font-bold text-lg text-[#24251F] mb-4">
                Saved Meals ({favoriteMeals.length})
              </h3>
              {favoriteMeals.length === 0 ? (
                <div className="p-6 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] text-center text-xs text-[#6B6D5E]">
                  No saved meals yet. Click the heart icon on any meal card to pin it here.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteMeals.map((item) => (
                    <FoodCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Vendors */}
            <div className="pt-6 border-t border-[#E2DDD2]">
              <h3 className="font-serif font-bold text-lg text-[#24251F] mb-4">
                Saved Cafeterias ({favoriteVendors.length})
              </h3>
              {favoriteVendors.length === 0 ? (
                <div className="p-6 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] text-center text-xs text-[#6B6D5E]">
                  No saved cafeterias yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteVendors.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Order History */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {pastOrders.length === 0 ? (
              <div className="p-10 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] text-center text-xs text-[#6B6D5E]">
                No completed orders yet.
              </div>
            ) : (
              <div className="space-y-3">
                {pastOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#24251F]">
                        {ord.vendorName} • {ord.tokenCode}
                      </div>
                      <div className="text-xs text-[#6B6D5E] mt-0.5">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-[#24251F]">
                        ₦{ord.totalAmount.toLocaleString()}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-gray-500">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
