"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  MapPin,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Store,
  Trash2,
  Users,
  Utensils,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { institutions, vendors, menuItems, selectedInstitution } = useCampus();

  const [activeTab, setActiveTab] = useState<"institutions" | "vendors" | "moderation">("vendors");

  // Mock pending vendors awaiting verification
  const [pendingVendors, setPendingVendors] = useState([
    {
      id: "pending-1",
      name: "Bello Alley Sharwama & Grills",
      institution: "University of Ibadan",
      area: "Tedder & Mellanby Quad (Bello Alley)",
      applicantName: "Akinwunmi Johnson",
      phone: "+234 805 123 4567",
      appliedAt: "2 hours ago",
    },
    {
      id: "pending-2",
      name: "Great Ife Parfait & Smoothies",
      institution: "Obafemi Awolowo University",
      area: "New Bukka Food Village",
      applicantName: "Folake Adeleke",
      phone: "+234 814 999 8812",
      appliedAt: "Yesterday",
    },
  ]);

  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const handleApprove = (id: string) => {
    setApprovedIds((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Admin Header */}
        <div className="bg-[#24251F] text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#D7E7A5]">
              <Shield className="w-3.5 h-3.5" />
              <span>Campus Platform Administration Console</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl">
              Directory & Moderation Controls
            </h1>
            <p className="text-xs text-white/70">
              Manage multi-institution campuses, approve cafeteria operators, and audit menu price compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80">Active Campus:</span>
            <span className="px-3 py-1.5 rounded-xl bg-white/20 font-bold text-xs">
              {selectedInstitution.name}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-[#6B6D5E] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#A84C35]" />
              <span>Tertiary Institutions</span>
            </div>
            <div className="font-serif font-black text-2xl text-[#24251F]">
              {institutions.length} Active Campuses
            </div>
            <span className="text-[10px] text-[#3E5A17]">University of Ibadan (Flagship)</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-[#6B6D5E] text-xs font-bold uppercase tracking-wider">
              <Store className="w-4 h-4 text-[#A84C35]" />
              <span>Verified Cafeterias</span>
            </div>
            <div className="font-serif font-black text-2xl text-[#24251F]">
              {vendors.length} Verified Vendors
            </div>
            <span className="text-[10px] text-[#A84C35]">
              {pendingVendors.length - approvedIds.length} awaiting review
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-[#6B6D5E] text-xs font-bold uppercase tracking-wider">
              <Utensils className="w-4 h-4 text-[#A84C35]" />
              <span>Audited Dishes</span>
            </div>
            <div className="font-serif font-black text-2xl text-[#24251F]">
              {menuItems.length} Live Menu Items
            </div>
            <span className="text-[10px] text-[#3E5A17]">100% price verified in NGN</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E2DDD2] gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("vendors")}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === "vendors"
                ? "border-[#A84C35] text-[#A84C35]"
                : "border-transparent text-[#6B6D5E] hover:text-[#24251F]"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Vendor Approvals ({pendingVendors.length - approvedIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("institutions")}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === "institutions"
                ? "border-[#A84C35] text-[#A84C35]"
                : "border-transparent text-[#6B6D5E] hover:text-[#24251F]"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Institution Registry</span>
          </button>

          <button
            onClick={() => setActiveTab("moderation")}
            className={`pb-3 transition flex items-center gap-2 border-b-2 ${
              activeTab === "moderation"
                ? "border-[#A84C35] text-[#A84C35]"
                : "border-transparent text-[#6B6D5E] hover:text-[#24251F]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Price Moderation & Audits</span>
          </button>
        </div>

        {/* Tab 1: Vendor Approvals */}
        {activeTab === "vendors" && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#24251F]">
              Pending Campus Cafeteria Applications
            </h2>

            <div className="space-y-3">
              {pendingVendors.map((item) => {
                const isApproved = approvedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#24251F]">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F6F3EC] text-[#24251F]">
                          {item.institution}
                        </span>
                      </div>
                      <div className="text-xs text-[#6B6D5E]">
                        Location: {item.area} • Applicant: {item.applicantName} ({item.phone})
                      </div>
                      <div className="text-[11px] text-[#6B6D5E]">
                        Submitted {item.appliedAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {isApproved ? (
                        <span className="px-3 py-1.5 rounded-xl bg-[#F3F8E5] text-[#3E5A17] text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approved & Verified</span>
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-4 py-2 rounded-xl bg-[#24251F] text-white text-xs font-bold hover:bg-black transition flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#D7E7A5]" />
                            <span>Verify & Grant Access</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Institutions */}
        {activeTab === "institutions" && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#24251F]">
              Configured Tertiary Institutions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {institutions.map((inst) => (
                <div
                  key={inst.id}
                  className="p-5 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-[#24251F] text-white">
                      {inst.logoText}
                    </span>
                    <span className="text-xs text-[#3E5A17] font-semibold">
                      {inst.campusAreas.length} Campus Areas
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-[#24251F]">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-[#6B6D5E] mt-0.5">
                      {inst.city}, {inst.state}
                    </p>
                  </div>

                  <p className="text-xs text-[#6B6D5E] line-clamp-2">
                    {inst.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Moderation */}
        {activeTab === "moderation" && (
          <div className="p-8 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] text-center space-y-3">
            <ShieldCheck className="w-10 h-10 mx-auto text-[#3E5A17]" />
            <h3 className="font-serif font-bold text-lg text-[#24251F]">
              Price Integrity & Verification Audit
            </h3>
            <p className="text-xs text-[#6B6D5E] max-w-md mx-auto">
              All listed meals undergo automated sanity checks ensuring prices are listed in genuine Nigerian Naira (₦400 - ₦3,500) and associated with real physical cafeteria kiosks on campus.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
