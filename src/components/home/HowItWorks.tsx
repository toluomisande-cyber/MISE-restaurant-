"use client";

import React from "react";
import { Sparkles, TicketCheck, WalletCards } from "lucide-react";
import Link from "next/link";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Enter Your Pocket Budget",
      desc: "Specify how much you can afford in Naira (e.g. ₦800, ₦1,200). MISE Campus deterministically eliminates dishes above your allowance.",
      icon: WalletCards,
      tag: "Budget Transparent",
    },
    {
      num: "02",
      title: "Grounded AI Recommendations",
      desc: "Tell our AI your craving and time before your next lecture. It cross-references verified cafeteria inventories with zero hallucinated prices.",
      icon: Sparkles,
      tag: "100% Catalog Grounded",
    },
    {
      num: "03",
      title: "Zero-Queue Token Pickup",
      desc: "Confirm your meal to receive a unique student pickup token code (e.g. UI-824). Walk up to the cafeteria counter and collect your warm food.",
      icon: TicketCheck,
      tag: "Skip Long Lines",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-[#E2DDD2] bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A84C35]">
            Built For Nigerian Campus Realities
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#24251F]">
            How MISE Campus Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6D5E] leading-relaxed">
            Eliminating wasted lecture breaks, misleading food prices, and chaotic cafeteria queues across tertiary institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl border border-[#E2DDD2] bg-[#F6F3EC]/50 p-6 sm:p-8 flex flex-col justify-between hover:bg-[#F6F3EC] transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#E2DDD2] flex items-center justify-center text-[#24251F] shadow-2xs">
                      <Icon className="w-6 h-6 text-[#A84C35]" />
                    </div>
                    <span className="font-serif font-black text-2xl text-[#E8D5C0]">
                      {step.num}
                    </span>
                  </div>

                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D7E7A5] text-[#24251F] mb-3">
                    {step.tag}
                  </span>

                  <h3 className="font-serif font-bold text-lg text-[#24251F] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#6B6D5E] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA banner */}
        <div className="mt-14 rounded-2xl bg-[#24251F] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif font-bold text-xl sm:text-2xl">
              Ready to find lunch before your next lecture?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-lg">
              Check live prices across SUB, Tedder Hall, Queen Idia, and Tech LLT right now.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/ai-finder"
              className="px-5 py-3 rounded-xl bg-[#D7E7A5] text-[#24251F] font-bold text-xs sm:text-sm hover:bg-[#cbe090] transition shadow-xs"
            >
              Ask AI Food Finder
            </Link>
            <Link
              href="/discover"
              className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition"
            >
              Browse Campus Menus
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
