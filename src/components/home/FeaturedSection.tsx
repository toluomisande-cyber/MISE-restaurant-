"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { FoodCard } from "@/components/food/FoodCard";
import { VendorCard } from "@/components/vendor/VendorCard";
import { ArrowRight, Flame, MapPin, Store } from "lucide-react";
import Link from "next/link";

export const FeaturedSection: React.FC = () => {
  const { menuItems, vendors, selectedInstitution } = useCampus();
  const [activeAreaFilter, setActiveAreaFilter] = useState<string>("all");

  // Filter items matching active school
  const schoolItems = menuItems.filter(
    (item) => item.institutionId === selectedInstitution.id
  );

  // Filter vendors matching active school
  const schoolVendors = vendors.filter(
    (vendor) => vendor.institutionId === selectedInstitution.id
  );

  const filteredItems = activeAreaFilter === "all"
    ? schoolItems
    : schoolItems.filter((item) => {
        const v = vendors.find((v) => v.id === item.vendorId);
        return v && v.campusAreaId === activeAreaFilter;
      });

  const popularMeals = filteredItems.slice(0, 6);

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Section 1: Popular Campus Meals */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF3F0] text-[#A84C35] mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Campus Craving Hits</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#24251F]">
              Top Student Picks at {selectedInstitution.shortName}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6D5E] mt-1">
              Real cafeteria dishes verified for student budget, portion size, and fast assembly.
            </p>
          </div>

          {/* Campus Area Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveAreaFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                activeAreaFilter === "all"
                  ? "bg-[#24251F] text-white"
                  : "bg-[#FFFFFF] border border-[#E2DDD2] text-[#6B6D5E] hover:text-[#24251F]"
              }`}
            >
              All Campus Areas
            </button>
            {selectedInstitution.campusAreas.slice(0, 4).map((area) => (
              <button
                key={area.id}
                onClick={() => setActiveAreaFilter(area.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1 ${
                  activeAreaFilter === area.id
                    ? "bg-[#24251F] text-white"
                    : "bg-[#FFFFFF] border border-[#E2DDD2] text-[#6B6D5E] hover:text-[#24251F]"
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{area.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularMeals.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFFFF] border border-[#E2DDD2] hover:border-[#A84C35] text-xs font-bold text-[#24251F] shadow-xs transition"
          >
            <span>Explore All {schoolItems.length} Campus Meals</span>
            <ArrowRight className="w-4 h-4 text-[#A84C35]" />
          </Link>
        </div>
      </div>

      {/* Section 2: Verified Campus Cafeterias */}
      <div className="pt-8 border-t border-[#E2DDD2]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F8E5] text-[#3E5A17] mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Verified Campus Spots</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#24251F]">
              Active Cafeterias & Food Vendors
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6D5E] mt-1">
              Located directly around halls of residence, faculties, and the student union building.
            </p>
          </div>

          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A84C35] hover:text-[#803723] transition self-start sm:self-auto"
          >
            <span>View All Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schoolVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </section>
  );
};
