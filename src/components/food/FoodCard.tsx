"use client";

import React, { useState } from "react";
import { MenuItem, Vendor } from "@/types/campus";
import { useCampus } from "@/context/CampusContext";
import { Clock, Heart, Plus, ShieldCheck, Sparkles, Check } from "lucide-react";
import Image from "next/image";

interface FoodCardProps {
  item: MenuItem;
  vendor?: Vendor;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, vendor }) => {
  const { vendors, addToCart, savedMealIds, toggleSavedMeal } = useCampus();
  const [selectedVariants, setSelectedVariants] = useState<{ name: string; priceDelta: number }[]>([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const [imgSrc, setImgSrc] = useState(item.imageUrl);
  const [prevUrl, setPrevUrl] = useState(item.imageUrl);
  if (prevUrl !== item.imageUrl) {
    setPrevUrl(item.imageUrl);
    setImgSrc(item.imageUrl);
  }

  // Find vendor if not passed directly
  const itemVendor = vendor || vendors.find((v) => v.id === item.vendorId);
  const isSaved = savedMealIds.includes(item.id);

  const calculateTotalPrice = () => {
    const delta = selectedVariants.reduce((sum, v) => sum + v.priceDelta, 0);
    return item.price + delta;
  };

  const handleAddClick = () => {
    if (item.variants && item.variants.length > 0 && !showVariantModal) {
      setShowVariantModal(true);
      return;
    }

    if (itemVendor) {
      addToCart(item, itemVendor, 1, selectedVariants);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
      setShowVariantModal(false);
      setSelectedVariants([]);
    }
  };

  const toggleVariant = (v: { name: string; priceDelta: number }) => {
    if (selectedVariants.some((sel) => sel.name === v.name)) {
      setSelectedVariants((prev) => prev.filter((sel) => sel.name !== v.name));
    } else {
      setSelectedVariants((prev) => [...prev, v]);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] overflow-hidden card-subtle transition-all duration-200">
        {/* Image Container */}
        <div className="relative h-44 w-full bg-[#E8D5C0]/40 overflow-hidden">
          <Image
            src={imgSrc || "/images/food/food-placeholder.svg"}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgSrc("/images/food/food-placeholder.svg")}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

          {/* Category & Verified Tag */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-[#24251F] shadow-xs backdrop-blur-xs">
              {item.categoryName}
            </span>
            {item.isPopular && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D7E7A5] text-[#24251F] flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                Popular
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => toggleSavedMeal(item.id)}
            aria-label={isSaved ? "Remove from saved" : "Save meal"}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#24251F] hover:bg-white transition shadow-xs"
          >
            <Heart
              className={`w-4 h-4 ${
                isSaved ? "fill-[#A84C35] text-[#A84C35]" : "text-[#24251F]"
              }`}
            />
          </button>

          {/* Portion pill bottom left */}
          <div className="absolute bottom-2.5 left-3 text-[11px] text-white/95 font-medium flex items-center gap-1 drop-shadow-md">
            <span>{item.portionSize}</span>
          </div>

          {/* Prep time badge bottom right */}
          <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium flex items-center gap-1 backdrop-blur-xs">
            <Clock className="w-2.5 h-2.5 text-[#D7E7A5]" />
            <span>{item.prepTimeMinutes}m prep</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex-1">
            <h3 className="font-serif font-bold text-base text-[#24251F] group-hover:text-[#A84C35] transition leading-snug">
              {item.name}
            </h3>

            <p className="text-xs text-[#6B6D5E] mt-1.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            {/* Vendor & Location info */}
            {itemVendor && (
              <div className="mt-3 pt-2.5 border-t border-[#E2DDD2]/60 flex items-center justify-between text-xs text-[#6B6D5E]">
                <span className="font-medium text-[#24251F] truncate max-w-[160px]">
                  {itemVendor.name}
                </span>
                <span className="text-[11px] text-[#A84C35] font-semibold shrink-0">
                  {itemVendor.campusAreaName.split(" ")[0]}
                </span>
              </div>
            )}
          </div>

          {/* Footer: Price & Add Button */}
          <div className="mt-4 pt-3 border-t border-[#E2DDD2] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#6B6D5E] tracking-wider">
                Student Price
              </div>
              <div className="font-bold text-base text-[#24251F]">
                ₦{item.price.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleAddClick}
              disabled={!item.isAvailable}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                !item.isAvailable
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : justAdded
                  ? "bg-[#D7E7A5] text-[#24251F]"
                  : "bg-[#24251F] text-white hover:bg-black"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{item.variants && item.variants.length > 0 ? "Options" : "Add"}</span>
                </>
              )}
            </button>
          </div>

          {/* Verification timestamp pill */}
          <div className="mt-2 text-[10px] text-[#6B6D5E] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#3E5A17]" />
            <span>Verified cafeteria rate</span>
          </div>
        </div>
      </div>

      {/* Variant Selection Modal */}
      {showVariantModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl border border-[#E2DDD2] p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-[#24251F]">
                  Customize: {item.name}
                </h4>
                <p className="text-xs text-[#6B6D5E] mt-0.5">
                  Select protein or extra portions from {itemVendor?.name}
                </p>
              </div>
              <button
                onClick={() => setShowVariantModal(false)}
                className="text-[#6B6D5E] hover:text-[#24251F] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {item.variants?.map((v) => {
                const isSelected = selectedVariants.some((sel) => sel.name === v.name);
                return (
                  <button
                    key={v.id}
                    onClick={() => toggleVariant(v)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${
                      isSelected
                        ? "border-[#A84C35] bg-[#FDF3F0] text-[#A84C35] font-semibold"
                        : "border-[#E2DDD2] hover:bg-[#F6F3EC] text-[#24251F]"
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className="font-bold">+₦{v.priceDelta.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E2DDD2] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#6B6D5E]">Total with Add-ons</div>
                <div className="font-bold text-base text-[#24251F]">
                  ₦{calculateTotalPrice().toLocaleString()}
                </div>
              </div>

              <button
                onClick={handleAddClick}
                className="px-4 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-semibold hover:bg-black transition"
              >
                Add to Tray
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
