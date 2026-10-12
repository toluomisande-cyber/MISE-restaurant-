"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import { Institution } from "@/types/campus";
import { Building2, Check, MapPin, Sparkles, X } from "lucide-react";

interface SchoolSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolSelectorModal: React.FC<SchoolSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedInstitution, setSelectedInstitution, institutions } =
    useCampus();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl bg-[#FFFFFF] rounded-2xl border border-[#E2DDD2] shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E2DDD2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3F8E5] text-[#3E5A17] mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Multi-Institution Campus Directory</span>
            </div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-serif font-bold text-[#24251F]">
              Select Your Campus
            </h2>
            <p className="text-sm text-[#6B6D5E] mt-1">
              Switching schools filters vendors, cafeteria menus, and student budget recommendations to that specific campus.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-[#F6F3EC] text-[#6B6D5E] hover:text-[#24251F] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Cards */}
        <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {institutions.map((inst: Institution) => {
            const isSelected = inst.id === selectedInstitution.id;
            return (
              <button
                key={inst.id}
                onClick={() => {
                  setSelectedInstitution(inst);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  isSelected
                    ? "border-[#A84C35] bg-[#FDF3F0] ring-1 ring-[#A84C35]/20"
                    : "border-[#E2DDD2] bg-[#FFFFFF] hover:bg-[#FBF9F5] hover:border-[#C8C1B2]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isSelected
                      ? "bg-[#A84C35] text-white shadow-sm"
                      : "bg-[#E8D5C0] text-[#24251F]"
                  }`}
                >
                  {inst.logoText}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-[#24251F]">
                      {inst.name}
                    </span>
                    {inst.slug === "ui" && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D7E7A5] text-[#24251F]">
                        Flagship Demo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B6D5E] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A84C35]" />
                    <span>
                      {inst.city}, {inst.state}
                    </span>
                    <span>•</span>
                    <span>{inst.activeVendorsCount} Cafeterias & Food Spots</span>
                  </div>
                  <p className="text-xs text-[#6B6D5E] mt-2 line-clamp-2">
                    {inst.description}
                  </p>
                </div>
                <div className="shrink-0 self-center">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#A84C35] text-white flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-[#C8C1B2]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#E2DDD2] flex items-center justify-between text-xs text-[#6B6D5E]">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#6B6D5E]" />
            <span>Independent campus platform. Not officially affiliated.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#24251F] text-white font-medium hover:bg-black transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
