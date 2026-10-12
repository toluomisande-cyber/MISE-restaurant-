"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCampus } from "@/context/CampusContext";
import { SchoolSelectorModal } from "@/components/campus/SchoolSelectorModal";
import { Building2, Heart, ShieldCheck, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  const { selectedInstitution } = useCampus();
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  return (
    <>
      <footer className="mt-auto border-t border-[#E2DDD2] bg-[#FFFFFF] text-[#24251F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Col 1: Wordmark & Mission */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#24251F] text-[#D7E7A5] font-serif font-black flex items-center justify-center text-sm">
                  M
                </div>
                <span className="font-serif font-black text-xl tracking-tight text-[#24251F]">
                  MISE<span className="text-[#A84C35]">.</span>campus
                </span>
              </div>
              <p className="font-serif text-lg text-[#24251F] font-semibold italic">
                &quot;Your campus. Your cravings. Your budget.&quot;
              </p>
              <p className="text-xs text-[#6B6D5E] max-w-md leading-relaxed">
                Empowering Nigerian tertiary students with verified cafeteria menus, strict budget filtering in Naira, and fast zero-queue pickup. Designed around actual campus walking distances and lecture breaks.
              </p>

              {/* Current Campus Pill */}
              <div className="pt-2">
                <button
                  onClick={() => setIsSchoolModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F6F3EC] border border-[#E2DDD2] text-xs font-semibold text-[#24251F] hover:border-[#A84C35] transition"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#A84C35]" />
                  <span>Browsing: {selectedInstitution.name}</span>
                  <span className="text-[10px] text-[#A84C35] underline ml-1">Change</span>
                </button>
              </div>
            </div>

            {/* Col 2: Campus Features */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#24251F] tracking-wide">
                Campus Discovery
              </h4>
              <ul className="space-y-2 text-xs text-[#6B6D5E]">
                <li>
                  <Link href="/discover" className="hover:text-[#A84C35] transition">
                    Browse All Cafeterias
                  </Link>
                </li>
                <li>
                  <Link href="/ai-finder" className="hover:text-[#A84C35] transition flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#A84C35]" />
                    <span>AI Food Finder</span>
                  </Link>
                </li>
                <li>
                  <Link href="/budget" className="hover:text-[#A84C35] transition">
                    Student Budget Mode
                  </Link>
                </li>
                <li>
                  <Link href="/my-campus" className="hover:text-[#A84C35] transition">
                    My Campus Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Vendor & Platform */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#24251F] tracking-wide">
                For Food Vendors
              </h4>
              <ul className="space-y-2 text-xs text-[#6B6D5E]">
                <li>
                  <Link href="/vendor-portal" className="hover:text-[#A84C35] transition">
                    Vendor Kitchen Portal
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-[#A84C35] transition">
                    Campus Admin Directory
                  </Link>
                </li>
                <li>
                  <span className="text-[#3E5A17] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Menu Registry</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar & Disclaimer */}
          <div className="mt-12 pt-8 border-t border-[#E2DDD2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6D5E]">
            <p className="text-center sm:text-left">
              © 2026 MISE Campus. Built with care for tertiary students across Nigeria.
            </p>
            <div className="flex items-center gap-1 text-[11px]">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-[#A84C35] fill-[#A84C35]" />
              <span>for University of Ibadan & Nigerian Campuses</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#F6F3EC] border border-[#E2DDD2] text-[11px] text-[#6B6D5E] text-center leading-relaxed">
            <strong>Notice:</strong> MISE Campus is an independent food discovery and budget technology initiative for tertiary students. Unless explicitly confirmed, MISE Campus is not an official university-administered service. All cafeteria menu items and prices are verified with respective campus operators.
          </div>
        </div>
      </footer>

      <SchoolSelectorModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
      />
    </>
  );
};
