"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { MENU_CATEGORIES } from "@/lib/data/mockData";
import {
  ArrowRight,
  Building2,
  Compass,
  MapPin,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { selectedInstitution } = useCampus();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<number | null>(1500);

  const budgetOptions = [
    { label: "₦500", value: 500, note: "Quick saver" },
    { label: "₦1,000", value: 1000, note: "Solid lunch" },
    { label: "₦1,500", value: 1500, note: "Popular", highlight: true },
    { label: "₦2,000", value: 2000, note: "Heavy combo" },
    { label: "₦2,500+", value: 2500, note: "Deluxe treat" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/discover");
    }
  };

  const handleBudgetClick = (amount: number) => {
    setSelectedBudget(amount);
    router.push(`/budget?max=${amount}`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-[#E2DDD2] bg-[#F6F3EC]">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 rounded-full bg-[#D7E7A5]/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 rounded-full bg-[#E8D5C0]/40 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Active Campus Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs text-xs font-semibold text-[#24251F]">
            <span className="w-2 h-2 rounded-full bg-[#3E5A17] animate-pulse" />
            <Building2 className="w-3.5 h-3.5 text-[#A84C35]" />
            <span>Currently browsing: <strong>{selectedInstitution.name}</strong></span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#D7E7A5] text-[#24251F]">
              Live
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-serif font-black text-4xl sm:text-6xl text-[#24251F] tracking-tight leading-[1.12]">
            Your next meal is <br />
            <span className="relative inline-block text-[#A84C35] italic">
              closer than you think.
              <svg
                className="absolute left-0 -bottom-2 w-full h-3 text-[#D7E7A5]/80 -z-10"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="8" />
              </svg>
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-[#6B6D5E] max-w-2xl mx-auto leading-relaxed">
            AI-assisted food discovery, verified cafeteria menus, and transparent student budgeting designed specifically for tertiary campuses in Nigeria.
          </p>

          {/* Live Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-2xl mx-auto flex items-center p-2 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-md focus-within:border-[#A84C35] focus-within:ring-2 focus-within:ring-[#A84C35]/10 transition"
          >
            <div className="pl-3 pr-2 text-[#6B6D5E]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes or cafeterias (e.g., Amala, Jollof, Ewa Aganyin, Tech Indomie)..."
              className="flex-1 bg-transparent text-sm sm:text-base text-[#24251F] placeholder-[#6B6D5E]/60 focus:outline-hidden py-2"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#24251F] hover:bg-black text-white text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Student Budget Selector */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#6B6D5E]">
              <Wallet className="w-3.5 h-3.5 text-[#A84C35]" />
              <span>Filter by your available student pocket money:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {budgetOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleBudgetClick(opt.value)}
                  className={`group px-3.5 py-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 ${
                    selectedBudget === opt.value
                      ? "bg-[#24251F] text-white border-[#24251F] shadow-xs"
                      : "bg-[#FFFFFF] text-[#24251F] border-[#E2DDD2] hover:border-[#A84C35]"
                  }`}
                >
                  <span className="font-bold">{opt.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      selectedBudget === opt.value
                        ? "bg-white/20 text-white"
                        : "bg-[#F6F3EC] text-[#6B6D5E]"
                    }`}
                  >
                    {opt.note}
                  </span>
                </button>
              ))}

              <Link
                href="/budget"
                className="px-3.5 py-2 rounded-xl border border-dashed border-[#A84C35] text-xs font-semibold text-[#A84C35] hover:bg-[#FDF3F0] transition"
              >
                Custom Budget ₦ →
              </Link>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ai-finder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D7E7A5] text-[#24251F] font-bold text-xs sm:text-sm hover:bg-[#cde094] transition shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-[#3E5A17]" />
              <span>Launch AI Food Finder</span>
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD2] text-[#24251F] font-semibold text-xs sm:text-sm hover:bg-[#FBF9F5] transition shadow-2xs"
            >
              <Compass className="w-4 h-4 text-[#A84C35]" />
              <span>View All Campus Menus</span>
            </Link>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-14 pt-8 border-t border-[#E2DDD2]">
          <div className="text-center mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6D5E]">
              Nigerian Campus Food Staples
            </h2>
          </div>
          <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/discover?category=${encodeURIComponent(cat.name)}`}
                className="group shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2DDD2] hover:border-[#A84C35] hover:bg-[#FDF3F0] transition text-xs font-semibold text-[#24251F]"
              >
                <span className="text-base group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
