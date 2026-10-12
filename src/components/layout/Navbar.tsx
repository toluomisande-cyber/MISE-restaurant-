"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCampus } from "@/context/CampusContext";
import { SchoolSelectorModal } from "@/components/campus/SchoolSelectorModal";
import {
  Building2,
  ChevronDown,
  Compass,
  Menu,
  ShoppingBag,
  Sparkles,
  User,
  Wallet,
  X,
  Store,
  ShieldAlert,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    selectedInstitution,
    cartItemCount,
    setIsCartOpen,
    activeRole,
    setActiveRole,
    orders,
  } = useCampus();

  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  ).length;

  const navLinks = [
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/ai-finder", label: "AI Food Finder", icon: Sparkles, badge: "AI" },
    { href: "/budget", label: "Budget Mode", icon: Wallet },
    {
      href: "/my-campus",
      label: "My Campus",
      icon: User,
      activeBadge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    { href: "/vendor-portal", label: "Vendor Portal", icon: Store },
    { href: "/admin", label: "Admin", icon: ShieldAlert },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand Wordmark & School Selector */}
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-[#24251F] text-[#D7E7A5] font-serif font-black flex items-center justify-center text-lg tracking-tighter group-hover:bg-[#A84C35] transition">
                  M
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-black text-lg tracking-tight text-[#24251F] leading-none">
                    MISE<span className="text-[#A84C35]">.</span>campus
                  </span>
                  <span className="text-[9px] font-bold text-[#6B6D5E] tracking-widest uppercase mt-0.5">
                    Student Food Hub
                  </span>
                </div>
              </Link>

              {/* School Switcher Button */}
              <button
                onClick={() => setIsSchoolModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2DDD2] hover:border-[#C8C1B2] text-xs font-semibold text-[#24251F] shadow-2xs transition"
                title="Change Campus"
              >
                <Building2 className="w-3.5 h-3.5 text-[#A84C35]" />
                <span className="max-w-[130px] truncate">
                  {selectedInstitution.shortName}
                </span>
                <ChevronDown className="w-3 h-3 text-[#6B6D5E]" />
              </button>
            </div>

            {/* Middle: Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#24251F] text-white shadow-2xs"
                        : "text-[#6B6D5E] hover:text-[#24251F] hover:bg-[#E8D5C0]/40"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#D7E7A5] text-[#24251F]">
                        {link.badge}
                      </span>
                    )}
                    {link.activeBadge && (
                      <span className="w-4 h-4 rounded-full text-[10px] font-bold bg-[#A84C35] text-white flex items-center justify-center">
                        {link.activeBadge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Role Switcher & Cart Trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Indicator Pill */}
              <div className="hidden sm:flex items-center border border-[#E2DDD2] rounded-full p-0.5 bg-[#FFFFFF] text-[11px] font-medium text-[#6B6D5E]">
                <button
                  onClick={() => setActiveRole("student")}
                  className={`px-2.5 py-1 rounded-full transition ${
                    activeRole === "student"
                      ? "bg-[#24251F] text-white font-semibold"
                      : "hover:text-[#24251F]"
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setActiveRole("vendor")}
                  className={`px-2.5 py-1 rounded-full transition ${
                    activeRole === "vendor"
                      ? "bg-[#A84C35] text-white font-semibold"
                      : "hover:text-[#24251F]"
                  }`}
                >
                  Vendor
                </button>
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2DDD2] hover:border-[#C8C1B2] text-xs font-semibold text-[#24251F] shadow-2xs transition"
                aria-label={`Open Cart with ${cartItemCount} items`}
              >
                <ShoppingBag className="w-4 h-4 text-[#A84C35]" />
                <span className="hidden sm:inline">Tray</span>
                {cartItemCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#A84C35] text-white text-[10px] font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-[#E2DDD2] bg-[#FFFFFF] text-[#24251F]"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E2DDD2] bg-[#F6F3EC] px-4 pt-3 pb-6 space-y-3">
            {/* Mobile School Switcher */}
            <button
              onClick={() => {
                setIsSchoolModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2DDD2] text-xs font-semibold text-[#24251F]"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#A84C35]" />
                <span>Campus: {selectedInstitution.name}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#6B6D5E]" />
            </button>

            {/* Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                      isActive
                        ? "bg-[#24251F] text-white font-semibold"
                        : "text-[#24251F] hover:bg-[#E8D5C0]/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D7E7A5] text-[#24251F]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* School Switcher Modal */}
      <SchoolSelectorModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
      />
    </>
  );
};
