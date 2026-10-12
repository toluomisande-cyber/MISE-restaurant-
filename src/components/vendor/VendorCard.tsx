"use client";

import React from "react";
import { Vendor } from "@/types/campus";
import { useCampus } from "@/context/CampusContext";
import { Clock, Heart, MapPin, ShieldCheck, ArrowRight, Utensils } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const { menuItems, savedVendorIds, toggleSavedVendor } = useCampus();
  const isSaved = savedVendorIds.includes(vendor.id);
  const vendorMenuCount = menuItems.filter((i) => i.vendorId === vendor.id).length;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] overflow-hidden card-subtle transition-all duration-200">
      {/* Banner */}
      <div className="relative h-36 w-full bg-[#E8D5C0]/40 overflow-hidden">
        <Image
          src={vendor.bannerImage}
          alt={vendor.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.currentTarget as unknown as HTMLImageElement;
            target.src = "/images/food/food-placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-xs backdrop-blur-xs ${
              vendor.isOpenNow
                ? "bg-[#D7E7A5] text-[#24251F]"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                vendor.isOpenNow ? "bg-[#3E5A17] animate-pulse" : "bg-gray-400"
              }`}
            />
            {vendor.isOpenNow ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSavedVendor(vendor.id);
          }}
          aria-label={isSaved ? "Remove from favorites" : "Save vendor"}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#24251F] hover:bg-white transition shadow-xs"
        >
          <Heart
            className={`w-4 h-4 ${
              isSaved ? "fill-[#A84C35] text-[#A84C35]" : "text-[#24251F]"
            }`}
          />
        </button>

        {/* Price & Rating Tag */}
        <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold flex items-center gap-2 drop-shadow-md">
          <span>{vendor.priceRange}</span>
          <span>•</span>
          <span>★ {vendor.rating.toFixed(1)}</span>
          <span className="text-white/80 text-[11px]">({vendor.totalReviews})</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-base text-[#24251F] group-hover:text-[#A84C35] transition leading-snug">
              {vendor.name}
            </h3>
            {vendor.verifiedStatus === "verified_campus_vendor" && (
              <span title="Verified Campus Vendor" className="shrink-0 text-[#3E5A17] mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <p className="text-xs text-[#6B6D5E] mt-1 line-clamp-1 italic">
            &quot;{vendor.tagline}&quot;
          </p>

          {/* Location & Hours */}
          <div className="mt-3 space-y-1.5 text-xs text-[#6B6D5E]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A84C35] shrink-0" />
              <span className="truncate">{vendor.campusAreaName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6B6D5E] shrink-0" />
              <span>{vendor.openingHours}</span>
            </div>
          </div>

          {/* Category Chips */}
          <div className="mt-3 flex flex-wrap gap-1">
            {vendor.categories.map((cat, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-[#F6F3EC] text-[10px] font-medium text-[#24251F] border border-[#E2DDD2]"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-4 pt-3 border-t border-[#E2DDD2] flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-[#6B6D5E]">
            <Utensils className="w-3.5 h-3.5" />
            <span>{vendorMenuCount} meals listed</span>
          </div>

          <Link
            href={`/vendor/${vendor.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#A84C35] hover:text-[#803723] transition group-hover:translate-x-0.5"
          >
            <span>View Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
