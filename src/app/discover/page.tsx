"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useCampus } from "@/context/CampusContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FoodCard } from "@/components/food/FoodCard";
import { VendorCard } from "@/components/vendor/VendorCard";
import { MENU_CATEGORIES } from "@/lib/data/mockData";
import {
  Compass,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Store,
  Utensils,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const { menuItems, vendors, selectedInstitution } = useCampus();

  const [activeTab, setActiveTab] = useState<"dishes" | "vendors">("dishes");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "prep-time" | "popular">("popular");
  const [dietaryTag, setDietaryTag] = useState<string>("All");

  // Filter school items
  const schoolItems = useMemo(() => {
    return menuItems.filter((i) => i.institutionId === selectedInstitution.id);
  }, [menuItems, selectedInstitution.id]);

  const schoolVendors = useMemo(() => {
    return vendors.filter((v) => v.institutionId === selectedInstitution.id);
  }, [vendors, selectedInstitution.id]);

  // Filter dishes
  const filteredItems = useMemo(() => {
    let result = schoolItems;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.categoryName.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((i) => i.categoryName === selectedCategory);
    }

    if (selectedArea !== "All") {
      result = result.filter((i) => {
        const v = vendors.find((v) => v.id === i.vendorId);
        return v?.campusAreaId === selectedArea;
      });
    }

    if (maxPrice < 3000) {
      result = result.filter((i) => i.price <= maxPrice);
    }

    if (dietaryTag !== "All") {
      result = result.filter((i) => i.tags.includes(dietaryTag));
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "prep-time") return a.prepTimeMinutes - b.prepTimeMinutes;
      if (sortBy === "popular") return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0;
    });

    return result;
  }, [
    schoolItems,
    searchTerm,
    selectedCategory,
    selectedArea,
    maxPrice,
    dietaryTag,
    sortBy,
    vendors,
  ]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    let result = schoolVendors;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (selectedArea !== "All") {
      result = result.filter((v) => v.campusAreaId === selectedArea);
    }

    return result;
  }, [schoolVendors, searchTerm, selectedArea]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedArea("All");
    setMaxPrice(3000);
    setSortBy("popular");
    setDietaryTag("All");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Page Header */}
        <div className="border-b border-[#E2DDD2] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFFFF] border border-[#E2DDD2] text-[#24251F] mb-2 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-[#A84C35]" />
              <span>Campus Directory • {selectedInstitution.name}</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#24251F]">
              Campus Food Discovery
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6D5E] mt-1 max-w-2xl">
              Search authentic university cafeteria menus, verified pricing in Naira, and pickup details across campus halls.
            </p>
          </div>

          {/* Toggle between dishes and vendors */}
          <div className="inline-flex p-1 rounded-xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs">
            <button
              onClick={() => setActiveTab("dishes")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "dishes"
                  ? "bg-[#24251F] text-white shadow-xs"
                  : "text-[#6B6D5E] hover:text-[#24251F]"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Dishes ({filteredItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("vendors")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "vendors"
                  ? "bg-[#24251F] text-white shadow-xs"
                  : "text-[#6B6D5E] hover:text-[#24251F]"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Cafeterias ({filteredVendors.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FFFFFF] p-4 sm:p-6 rounded-2xl border border-[#E2DDD2] shadow-xs space-y-4">
          {/* Top row: search + sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-[#6B6D5E] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search food by name, soup, stew, or vendor (e.g., Amala, Jollof, Ewa Aganyin)..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#E2DDD2] focus:outline-hidden focus:border-[#24251F] bg-[#F6F3EC]/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#6B6D5E] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price-asc" | "price-desc" | "prep-time" | "popular")}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#E2DDD2] bg-[#FFFFFF] text-[#24251F] focus:outline-hidden font-medium"
              >
                <option value="popular">Sort: Popular & Recommended</option>
                <option value="price-asc">Sort: Lowest Price First</option>
                <option value="price-desc">Sort: Highest Price First</option>
                <option value="prep-time">Sort: Fastest Prep Time</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                selectedCategory === "All"
                  ? "bg-[#24251F] text-white"
                  : "bg-[#F6F3EC] text-[#6B6D5E] hover:text-[#24251F]"
              }`}
            >
              All Categories
            </button>
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                  selectedCategory === cat.name
                    ? "bg-[#A84C35] text-white shadow-2xs"
                    : "bg-[#F6F3EC] text-[#24251F] hover:bg-[#E8D5C0]/60"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Secondary Filter Row: Campus Area, Price Slider, Reset */}
          <div className="pt-3 border-t border-[#E2DDD2] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Campus Area select */}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A84C35]" />
                <span className="text-[#6B6D5E] font-medium">Area:</span>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="p-1.5 rounded-lg border border-[#E2DDD2] bg-[#FFFFFF] font-semibold text-[#24251F] focus:outline-hidden"
                >
                  <option value="All">Entire Campus</option>
                  {selectedInstitution.campusAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Cap Slider */}
              <div className="flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-[#A84C35]" />
                <span className="text-[#6B6D5E] font-medium">Max Budget:</span>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#A84C35]"
                />
                <span className="font-bold text-[#24251F]">
                  {maxPrice >= 3000 ? "Any ₦" : `₦${maxPrice.toLocaleString()}`}
                </span>
              </div>

              {/* Quick dietary tag */}
              <div className="flex items-center gap-1">
                {["All", "Spicy", "High Protein", "Breakfast King"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setDietaryTag(tag)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                      dietaryTag === tag
                        ? "bg-[#D7E7A5] text-[#24251F] font-bold"
                        : "bg-[#F6F3EC] text-[#6B6D5E] hover:text-[#24251F]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-[#6B6D5E] hover:text-[#A84C35] flex items-center gap-1 underline transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === "dishes" ? (
          <div>
            {filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] p-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#F6F3EC] flex items-center justify-center text-[#6B6D5E]">
                  <Filter className="w-6 h-6 opacity-40" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#24251F]">
                  No matching cafeteria meals found
                </h3>
                <p className="text-xs text-[#6B6D5E] max-w-sm mx-auto">
                  Try increasing your maximum budget, clearing search terms, or checking another campus area.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-[#24251F] text-white text-xs font-semibold hover:bg-black transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredVendors.length === 0 ? (
              <div className="rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] p-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#F6F3EC] flex items-center justify-center text-[#6B6D5E]">
                  <Store className="w-6 h-6 opacity-40" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#24251F]">
                  No cafeterias match your criteria
                </h3>
                <p className="text-xs text-[#6B6D5E] max-w-sm mx-auto">
                  No verified vendors found with the current search query or area filter.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-[#24251F] text-white text-xs font-semibold hover:bg-black transition"
                >
                  View All Cafeterias
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
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

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]">
          <div className="font-serif font-bold text-base text-[#24251F]">
            Loading Campus Directory...
          </div>
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}

