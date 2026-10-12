"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FoodCard } from "@/components/food/FoodCard";
import {
  ArrowLeft,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export function VendorDetailClient({ vendorId }: { vendorId: string }) {
  const { vendors, menuItems, savedVendorIds, toggleSavedVendor } = useCampus();

  const vendor = vendors.find((v) => v.id === vendorId);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!vendor) {
    return notFound();
  }

  const isSaved = savedVendorIds.includes(vendor.id);
  const vendorItems = menuItems.filter((i) => i.vendorId === vendor.id);

  const categories = ["All", ...Array.from(new Set(vendorItems.map((i) => i.categoryName)))];

  const filteredItems = selectedCategory === "All"
    ? vendorItems
    : vendorItems.filter((i) => i.categoryName === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6D5E] hover:text-[#24251F] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campus Directory</span>
          </Link>
        </div>

        {/* Vendor Hero Card */}
        <div className="rounded-3xl border border-[#E2DDD2] bg-[#FFFFFF] overflow-hidden shadow-sm">
          {/* Banner */}
          <div className="relative h-48 sm:h-64 w-full bg-[#E8D5C0]/40">
            <Image
              src={vendor.bannerImage}
              alt={vendor.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              onError={(e) => {
                const target = e.currentTarget as unknown as HTMLImageElement;
                target.src = "/images/food/food-placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => toggleSavedVendor(vendor.id)}
                aria-label={isSaved ? "Saved" : "Save"}
                className="p-2.5 rounded-full bg-white/90 text-[#24251F] hover:bg-white transition shadow-sm"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isSaved ? "fill-[#A84C35] text-[#A84C35]" : "text-[#24251F]"
                  }`}
                />
              </button>
            </div>

            {/* Operating Status Pill */}
            <div className="absolute bottom-4 left-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs backdrop-blur-md ${
                  vendor.isOpenNow
                    ? "bg-[#D7E7A5] text-[#24251F]"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    vendor.isOpenNow ? "bg-[#3E5A17] animate-pulse" : "bg-gray-400"
                  }`}
                />
                {vendor.isOpenNow ? "Open & Cooking Now" : "Closed for the day"}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#24251F]">
                    {vendor.name}
                  </h1>
                  {vendor.verifiedStatus === "verified_campus_vendor" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F3F8E5] text-[#3E5A17]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Campus Vendor
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#A84C35] font-serif italic">
                  &quot;{vendor.tagline}&quot;
                </p>

                <p className="text-xs sm:text-sm text-[#6B6D5E] leading-relaxed">
                  {vendor.description}
                </p>
              </div>

              {/* Contact & Hours Box */}
              <div className="p-4 rounded-2xl bg-[#F6F3EC] border border-[#E2DDD2] space-y-3 shrink-0 min-w-[260px] text-xs">
                <div className="flex items-center gap-2 text-[#24251F]">
                  <MapPin className="w-4 h-4 text-[#A84C35] shrink-0" />
                  <div>
                    <div className="font-bold">{vendor.campusAreaName}</div>
                    <div className="text-[11px] text-[#6B6D5E]">{vendor.verifiedAddress}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#24251F]">
                  <Clock className="w-4 h-4 text-[#3E5A17] shrink-0" />
                  <div>
                    <div className="font-bold">Operating Hours</div>
                    <div className="text-[11px] text-[#6B6D5E]">{vendor.openingHours}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2DDD2] flex items-center gap-2">
                  <a
                    href={`tel:${vendor.contactPhone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#E2DDD2] font-semibold text-[#24251F] text-center hover:bg-[#FDF3F0] transition flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  {vendor.whatsappNumber && (
                    <a
                      href={`https://wa.me/${vendor.whatsappNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-[#24251F] text-white font-semibold text-center hover:bg-black transition flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Pickup Instructions Notice */}
            <div className="p-4 rounded-xl bg-[#FDF3F0] border border-[#A84C35]/20 flex items-start gap-3 text-xs">
              <Sparkles className="w-4 h-4 text-[#A84C35] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#A84C35]">Pickup Instructions:</strong>{" "}
                <span className="text-[#24251F]">{vendor.pickupInstructions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD2] pb-4">
            <div>
              <h2 className="font-serif font-black text-2xl text-[#24251F]">
                Today&apos;s Cafeteria Menu ({filteredItems.length})
              </h2>
              <div className="text-xs text-[#6B6D5E] mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3E5A17]" />
                <span>Last inventory check: {vendor.lastMenuUpdate}</span>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                    selectedCategory === cat
                      ? "bg-[#24251F] text-white"
                      : "bg-[#FFFFFF] border border-[#E2DDD2] text-[#6B6D5E] hover:text-[#24251F]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} vendor={vendor} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
