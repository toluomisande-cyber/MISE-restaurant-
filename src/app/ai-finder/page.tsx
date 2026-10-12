"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RecommendationItem, RecommendationResponse } from "@/types/campus";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  MapPin,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Utensils,
  Wallet,
} from "lucide-react";

export default function AiFoodFinderPage() {
  const { selectedInstitution, vendors, menuItems, addToCart } = useCampus();

  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState<number>(1500);
  const [maxWaitMinutes, setMaxWaitMinutes] = useState<number>(15);
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const examplePrompts = [
    {
      label: "₦1,500 Filling Lecture Break",
      query: "I have ₦1,500 and need something hearty and quick before my next lecture.",
      budget: 1500,
      time: 15,
    },
    {
      label: "Under ₦1,000 Swallow & Soup",
      query: "Authentic Amala or swallow with good soup under ₦1,000.",
      budget: 1000,
      time: 10,
    },
    {
      label: "Fast Morning Breakfast",
      query: "Hot Ewa Aganyin or pastry breakfast to grab in 5 minutes.",
      budget: 900,
      time: 8,
    },
    {
      label: "Engineering Night Fuel",
      query: "Spicy stir-fry noodles or pasta around Tech Faculty.",
      budget: 1400,
      time: 12,
    },
  ];

  const handleApplyExample = (ex: typeof examplePrompts[0]) => {
    setQuery(ex.query);
    setBudget(ex.budget);
    setMaxWaitMinutes(ex.time);
  };

  const handleConsultAi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/food/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionId: selectedInstitution.id,
          budget: Number(budget),
          query: query.trim() || undefined,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          campusAreaId: selectedArea !== "all" ? selectedArea : undefined,
          maxWaitMinutes: Number(maxWaitMinutes),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: RecommendationResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to reach recommendation engine. Please verify your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecToTray = (rec: RecommendationItem) => {
    const item = menuItems.find((i) => i.id === rec.menuItemId);
    const vendor = vendors.find((v) => v.id === rec.vendorId);
    if (item && vendor) {
      addToCart(item, vendor, 1);
      setAddedItemIds((prev) => [...prev, rec.menuItemId]);
      setTimeout(() => {
        setAddedItemIds((prev) => prev.filter((id) => id !== rec.menuItemId));
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D7E7A5] text-[#24251F] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#3E5A17]" />
            <span>AI Food Finder • Grounded in Real Cafeteria Menus</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#24251F]">
            What should I eat on campus right now?
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6D5E] max-w-xl mx-auto leading-relaxed">
            Tell MISE Campus your budget in Naira, your craving, and how many minutes before your next lecture. Zero hallucinated menus. Zero invented prices.
          </p>
        </div>

        {/* Interactive Query Assistant Form */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E2DDD2] shadow-sm space-y-6">
          <form onSubmit={handleConsultAi} className="space-y-6">
            {/* Main Prompt Box */}
            <div>
              <label className="block font-serif font-bold text-sm text-[#24251F] mb-1.5">
                Your Craving or Schedule Request
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., I have ₦1,500 and need something filling before my 2 PM chemistry lecture at LLT..."
                  className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-[#E2DDD2] bg-[#F6F3EC]/40 focus:outline-hidden focus:border-[#A84C35] focus:ring-2 focus:ring-[#A84C35]/10 leading-relaxed"
                />
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#6B6D5E] uppercase tracking-wider">
                Or Try A Student Example:
              </span>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyExample(ex)}
                    className="px-3 py-1.5 rounded-xl border border-[#E2DDD2] bg-[#FFFFFF] hover:border-[#A84C35] hover:bg-[#FDF3F0] text-xs text-[#24251F] font-medium transition"
                  >
                    ✨ {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Strict Constraint Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E2DDD2]">
              {/* Pocket Budget Slider */}
              <div className="p-3.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC]/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#24251F] flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-[#A84C35]" />
                    Budget Cap
                  </span>
                  <span className="font-bold text-[#A84C35]">
                    ₦{budget.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="3500"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#A84C35]"
                />
                <div className="text-[10px] text-[#6B6D5E] flex justify-between">
                  <span>₦400</span>
                  <span>Strict maximum</span>
                  <span>₦3,500</span>
                </div>
              </div>

              {/* Lecture Break / Prep Time */}
              <div className="p-3.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC]/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#24251F] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#3E5A17]" />
                    Max Prep Time
                  </span>
                  <span className="font-bold text-[#3E5A17]">
                    {maxWaitMinutes} mins
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={maxWaitMinutes}
                  onChange={(e) => setMaxWaitMinutes(Number(e.target.value))}
                  className="w-full accent-[#3E5A17]"
                />
                <div className="text-[10px] text-[#6B6D5E] flex justify-between">
                  <span>5 mins</span>
                  <span>Between lectures</span>
                  <span>30 mins</span>
                </div>
              </div>

              {/* Campus Hall Area */}
              <div className="p-3.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC]/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#24251F] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A84C35]" />
                    Campus Location
                  </span>
                </div>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-[#E2DDD2] bg-[#FFFFFF] font-medium text-[#24251F] focus:outline-hidden"
                >
                  <option value="all">Any Campus Location</option>
                  {selectedInstitution.campusAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-[#6B6D5E]">
                  Filters closest cafeterias
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-[#24251F] hover:bg-black text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#D7E7A5]" />
                  <span>Evaluating Verified Cafeteria Menus...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D7E7A5]" />
                  <span>Get Grounded Meal Recommendations</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Results Display */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* AI Summary Banner */}
            <div className="rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] p-6 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DDD2] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#D7E7A5] text-[#24251F] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#24251F]">
                    Recommendation Analysis
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-[#F6F3EC] border border-[#E2DDD2] text-[#6B6D5E] font-medium">
                    Budget Cap: ₦{result.budget.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F3F8E5] text-[#3E5A17] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {result.source === "openrouter_ai" ? "OpenRouter AI Grounded" : "Verified Catalog Match"}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#24251F] leading-relaxed">
                {result.aiExplanation}
              </p>
            </div>

            {/* Empty state if 0 recommendations */}
            {result.recommendations.length === 0 ? (
              <div className="rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] p-10 text-center space-y-3">
                <Utensils className="w-10 h-10 mx-auto text-[#6B6D5E] opacity-40" />
                <h4 className="font-serif font-bold text-lg text-[#24251F]">
                  No matching dishes within ₦{result.budget.toLocaleString()}
                </h4>
                <p className="text-xs text-[#6B6D5E] max-w-md mx-auto">
                  Try raising your budget to ₦1,000 or ₦1,500, or expanding your prep time to view available cafeteria combos.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#24251F]">
                  Matching Campus Dishes ({result.recommendations.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.recommendations.map((rec) => {
                    const isAdded = addedItemIds.includes(rec.menuItemId);
                    return (
                      <div
                        key={rec.menuItemId}
                        className="rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] p-5 shadow-xs flex flex-col justify-between hover:border-[#A84C35] transition space-y-4"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-bold text-[#A84C35] bg-[#FDF3F0] px-2.5 py-0.5 rounded-md">
                              {rec.campusArea}
                            </span>
                            <span className="text-[11px] font-bold text-[#3E5A17] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {rec.prepTimeMinutes}m prep
                            </span>
                          </div>

                          {/* Dish Name & Vendor */}
                          <h4 className="font-serif font-bold text-base text-[#24251F]">
                            {rec.dishName}
                          </h4>
                          <div className="text-xs text-[#6B6D5E] mt-0.5">
                            Sold by: <strong>{rec.vendorName}</strong> • {rec.portionSize}
                          </div>

                          {/* Match Reason */}
                          <div className="mt-3 p-3 rounded-xl bg-[#F6F3EC] border border-[#E2DDD2]/60 text-xs text-[#24251F] leading-relaxed">
                            <div className="text-[10px] uppercase font-bold text-[#6B6D5E] tracking-wider mb-0.5">
                              Why this fits:
                            </div>
                            {rec.matchReason}
                          </div>
                        </div>

                        {/* Price & Add to Tray Button */}
                        <div className="pt-3 border-t border-[#E2DDD2] flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-[#6B6D5E] uppercase font-bold tracking-wider">
                              Verified Price
                            </div>
                            <div className="font-bold text-lg text-[#24251F]">
                              ₦{rec.listedPrice.toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddRecToTray(rec)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                              isAdded
                                ? "bg-[#D7E7A5] text-[#24251F]"
                                : "bg-[#24251F] text-white hover:bg-black"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-[#3E5A17]" />
                                <span>Added to Tray</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>Add to Tray</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
