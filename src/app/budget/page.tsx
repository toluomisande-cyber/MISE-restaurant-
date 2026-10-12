"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useCampus } from "@/context/CampusContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FoodCard } from "@/components/food/FoodCard";
import {
  ArrowUpDown,
  Coins,
  Plus,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function BudgetContent() {
  const searchParams = useSearchParams();
  const initialMax = Number(searchParams.get("max")) || 1500;

  const { menuItems, vendors, selectedInstitution, addToCart } = useCampus();
  const [budget, setBudget] = useState<number>(initialMax);
  const [customInput, setCustomInput] = useState<string>(initialMax.toString());
  const [sortBy, setSortBy] = useState<"best-value" | "cheapest" | "fastest">("best-value");

  const presetBudgets = [500, 1000, 1500, 2000, 2500];

  const handlePresetClick = (amount: number) => {
    setBudget(amount);
    setCustomInput(amount.toString());
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(customInput);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
    }
  };

  // Filter school items strictly by price <= budget
  const eligibleItems = useMemo(() => {
    const schoolItems = menuItems.filter(
      (item) => item.institutionId === selectedInstitution.id && item.isAvailable
    );
    const withinBudget = schoolItems.filter((item) => item.price <= budget);

    return [...withinBudget].sort((a, b) => {
      if (sortBy === "cheapest") return a.price - b.price;
      if (sortBy === "fastest") return a.prepTimeMinutes - b.prepTimeMinutes;
      // best-value: closest to budget or popular
      return b.price - a.price;
    });
  }, [menuItems, selectedInstitution.id, budget, sortBy]);

  // Generate a realistic 2-item combo under budget if budget >= 900
  const getComboSuggestion = () => {
    if (budget < 900) return null;

    const schoolItems = menuItems.filter(
      (item) => item.institutionId === selectedInstitution.id && item.isAvailable
    );
    const mainDishes = schoolItems.filter(
      (i) => i.categoryName === "Rice & Grains" || i.categoryName === "Swallow & Soups" || i.categoryName === "Beans & Porridge"
    );
    const sidesOrDrinks = schoolItems.filter(
      (i) => i.categoryName === "Drinks & Parfait" || i.categoryName === "Snacks & Pastries"
    );

    for (const main of mainDishes) {
      for (const side of sidesOrDrinks) {
        const comboTotal = main.price + side.price;
        if (comboTotal <= budget && comboTotal >= budget * 0.7) {
          const mainVendor = vendors.find((v) => v.id === main.vendorId);
          const sideVendor = vendors.find((v) => v.id === side.vendorId);
          return {
            main,
            side,
            mainVendor,
            sideVendor,
            comboTotal,
            change: budget - comboTotal,
          };
        }
      }
    }
    return null;
  };
  const comboSuggestion = getComboSuggestion();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFFFF] border border-[#E2DDD2] text-[#24251F] shadow-2xs">
            <Coins className="w-3.5 h-3.5 text-[#A84C35]" />
            <span>Student Pocket Money Mode • {selectedInstitution.shortName}</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#24251F]">
            Transparent Budget Discovery
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6D5E] leading-relaxed">
            Every naira counts on campus. Set your exact balance to view verified cafeteria meals you can comfortably afford today. Zero hidden service fees.
          </p>
        </div>

        {/* Interactive Budget Control Card */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E2DDD2] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#6B6D5E] uppercase tracking-wider">
                Current Budget Ceiling
              </span>
              <div className="font-serif font-black text-3xl sm:text-4xl text-[#A84C35] mt-0.5">
                ₦{budget.toLocaleString()}
              </div>
            </div>

            {/* Custom Amount Form */}
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B6D5E]">
                  ₦
                </span>
                <input
                  type="number"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Custom ₦"
                  className="w-32 text-xs font-bold pl-7 pr-3 py-2.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC]/50 focus:outline-hidden focus:border-[#24251F]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-semibold hover:bg-black transition"
              >
                Set
              </button>
            </form>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2DDD2]">
            <span className="text-xs text-[#6B6D5E] font-medium mr-1">Quick Presets:</span>
            {presetBudgets.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetClick(amount)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  budget === amount
                    ? "bg-[#24251F] text-white shadow-xs"
                    : "bg-[#F6F3EC] text-[#24251F] hover:bg-[#E8D5C0]/60"
                }`}
              >
                ₦{amount.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="400"
              max="3500"
              step="50"
              value={budget}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBudget(val);
                setCustomInput(val.toString());
              }}
              className="w-full accent-[#A84C35]"
            />
            <div className="flex justify-between text-[11px] font-semibold text-[#6B6D5E]">
              <span>₦400 (Pocket Snack)</span>
              <span>₦1,500 (Campus Average)</span>
              <span>₦3,500 (Deluxe Meal)</span>
            </div>
          </div>
        </div>

        {/* Combo Suggestion Banner */}
        {comboSuggestion && (
          <div className="rounded-2xl border border-[#D7E7A5] bg-[#F3F8E5] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D7E7A5] text-[#24251F]">
                <Sparkles className="w-3 h-3 text-[#3E5A17]" />
                <span>Smart Student Combo Suggestion</span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#24251F]">
                {comboSuggestion.main.name} + {comboSuggestion.side.name}
              </h3>
              <p className="text-xs text-[#6B6D5E]">
                Combo Total: <strong>₦{comboSuggestion.comboTotal.toLocaleString()}</strong> • Leaves you with{" "}
                <span className="text-[#3E5A17] font-bold">₦{comboSuggestion.change.toLocaleString()} change</span> from your ₦{budget.toLocaleString()} budget!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (comboSuggestion.mainVendor) {
                    addToCart(comboSuggestion.main, comboSuggestion.mainVendor, 1);
                  }
                  if (comboSuggestion.sideVendor) {
                    addToCart(comboSuggestion.side, comboSuggestion.sideVendor, 1);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-semibold hover:bg-black transition flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Both to Tray</span>
              </button>
            </div>
          </div>
        )}

        {/* Dishes List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#24251F]">
                Dishes Under ₦{budget.toLocaleString()} ({eligibleItems.length})
              </h2>
              <div className="text-xs text-[#6B6D5E] flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3E5A17]" />
                <span>All prices verified today with cafeteria operators</span>
              </div>
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6B6D5E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "best-value" | "cheapest" | "fastest")}
                className="text-xs py-2 px-3 rounded-xl border border-[#E2DDD2] bg-[#FFFFFF] font-semibold text-[#24251F] focus:outline-hidden"
              >
                <option value="best-value">Best Budget Utilization</option>
                <option value="cheapest">Cheapest First</option>
                <option value="fastest">Fastest Preparation</option>
              </select>
            </div>
          </div>

          {eligibleItems.length === 0 ? (
            <div className="rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FDF3F0] flex items-center justify-center text-[#A84C35]">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#24251F]">
                No meals found under ₦{budget.toLocaleString()}
              </h3>
              <p className="text-xs text-[#6B6D5E] max-w-sm mx-auto">
                Campus meals at {selectedInstitution.shortName} start at ₦400 for cold drinks/pastries and ₦800 for warm swallow and rice plates.
              </p>
              <button
                onClick={() => handlePresetClick(1000)}
                className="px-4 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-semibold hover:bg-black transition"
              >
                Try ₦1,000 Budget
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BudgetModePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]">
          <div className="font-serif font-bold text-base text-[#24251F]">
            Loading Student Budget Tool...
          </div>
        </div>
      }
    >
      <BudgetContent />
    </Suspense>
  );
}

