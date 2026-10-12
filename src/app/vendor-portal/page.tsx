"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrderStatus, FoodCategory } from "@/types/campus";
import {
  Edit2,
  PackageCheck,
  Plus,
  Store,
} from "lucide-react";
import { getVerifiedFoodImage } from "@/lib/data/foodImageMap";


export default function VendorPortalPage() {
  const {
    vendors,
    menuItems,
    orders,
    activeVendorId,
    setActiveVendorId,
    updateMenuItemAvailability,
    updateMenuItemPrice,
    addMenuItem,
    updateOrderStatus,
    selectedInstitution,
  } = useCampus();

  const currentVendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];

  const vendorMenuItems = menuItems.filter((i) => i.vendorId === currentVendor.id);
  const vendorOrders = orders.filter((o) => o.vendorId === currentVendor.id);

  // Quick state for inline price editing
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);

  // State for adding a new dish
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [newDishName, setNewDishName] = useState("");
  const [newDishPrice, setNewDishPrice] = useState<number>(1000);
  const [newDishCategory, setNewDishCategory] = useState<FoodCategory>("Rice & Grains");
  const [newDishDescription, setNewDishDescription] = useState("");
  const [newDishPortion, setNewDishPortion] = useState("Standard Plate");
  const [newDishPrepMins, setNewDishPrepMins] = useState(7);
  // note: newDishPortion and newDishPrepMins are used in the dish form below
  void setNewDishPortion; void setNewDishPrepMins;

  const startEditPrice = (itemId: string, currentPrice: number) => {
    setEditingItemId(itemId);
    setEditPriceValue(currentPrice);
  };

  const saveEditPrice = (itemId: string) => {
    if (editPriceValue > 0) {
      updateMenuItemPrice(itemId, editPriceValue);
    }
    setEditingItemId(null);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    addMenuItem({
      vendorId: currentVendor.id,
      institutionId: selectedInstitution.id,
      categoryId: "cat-new",
      categoryName: newDishCategory,
      name: newDishName.trim(),
      description: newDishDescription.trim() || "Freshly cooked cafeteria meal.",
      price: Number(newDishPrice),
      currency: "NGN",
      portionSize: newDishPortion,
      prepTimeMinutes: Number(newDishPrepMins),
      isAvailable: true,
      lastVerifiedAt: new Date().toISOString(),
      imageUrl: getVerifiedFoodImage("new-item", newDishCategory, "/images/food/food-placeholder.svg"),
      tags: ["Chef Special", "Freshly Cooked"],
    });

    setIsAddingDish(false);
    setNewDishName("");
    setNewDishDescription("");
  };

  // Status transitions
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case "pending":
        return "accepted";
      case "accepted":
        return "preparing";
      case "preparing":
        return "ready_for_pickup";
      case "ready_for_pickup":
        return "completed";
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Header with Vendor Switcher */}
        <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E2DDD2] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF3F0] text-[#A84C35]">
              <Store className="w-3.5 h-3.5" />
              <span>Cafeteria Operator Console</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#24251F]">
              {currentVendor.name}
            </h1>
            <p className="text-xs text-[#6B6D5E]">
              {currentVendor.campusAreaName} • {currentVendor.verifiedAddress}
            </p>
          </div>

          {/* Switch Active Vendor for Testing */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs font-semibold text-[#6B6D5E]">Switch Business:</span>
            <select
              value={activeVendorId}
              onChange={(e) => setActiveVendorId(e.target.value)}
              className="text-xs font-bold p-2.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC] text-[#24251F] focus:outline-hidden"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.campusAreaName.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6D5E]">
              Incoming Orders
            </span>
            <div className="font-serif font-black text-2xl text-[#24251F]">
              {vendorOrders.length}
            </div>
            <span className="text-[10px] text-[#3E5A17] font-semibold">Active in queue</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6D5E]">
              Dishes on Menu
            </span>
            <div className="font-serif font-black text-2xl text-[#24251F]">
              {vendorMenuItems.length}
            </div>
            <span className="text-[10px] text-[#6B6D5E]">
              {vendorMenuItems.filter((i) => i.isAvailable).length} available now
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6D5E]">
              Total Volume (Today)
            </span>
            <div className="font-serif font-black text-2xl text-[#A84C35]">
              ₦{vendorOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-[#3E5A17] font-semibold">Estimated Gross</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2DDD2] shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6D5E]">
              Operating State
            </span>
            <div className="font-serif font-bold text-lg text-[#3E5A17] flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3E5A17] animate-pulse" />
              <span>Accepting Orders</span>
            </div>
            <span className="text-[10px] text-[#6B6D5E]">{currentVendor.openingHours}</span>
          </div>
        </div>

        {/* Section 1: Live Orders Management Board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-[#24251F]">
              Active Kitchen Orders ({vendorOrders.length})
            </h2>
            <span className="text-xs text-[#6B6D5E]">
              Advance orders to notify students in real time
            </span>
          </div>

          {vendorOrders.length === 0 ? (
            <div className="p-8 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] text-center text-xs text-[#6B6D5E]">
              No incoming orders currently. Orders placed by students appear here immediately.
            </div>
          ) : (
            <div className="space-y-3">
              {vendorOrders.map((ord) => {
                const nextStatus = getNextStatus(ord.status);
                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-[#E2DDD2] bg-[#FFFFFF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#24251F] text-white font-mono font-bold text-xs">
                          Token: {ord.tokenCode}
                        </span>
                        <span className="text-xs font-semibold text-[#24251F]">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            ord.status === "ready_for_pickup"
                              ? "bg-[#D7E7A5] text-[#24251F]"
                              : ord.status === "completed"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-[#FDF3F0] text-[#A84C35]"
                          }`}
                        >
                          Status: {ord.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="text-xs text-[#24251F] font-medium">
                        Student: <strong>{ord.studentName}</strong> • Phone: {ord.studentPhone}
                      </div>

                      {/* Item list */}
                      <div className="text-xs text-[#6B6D5E]">
                        {ord.items.map((it, idx) => (
                          <span key={idx}>
                            {it.quantity}x {it.name} (₦{it.itemTotal.toLocaleString()})
                            {idx < ord.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>

                      {ord.specialInstructions && (
                        <div className="text-[11px] text-[#A84C35] italic">
                          Note: &quot;{ord.specialInstructions}&quot;
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <div className="text-right">
                        <div className="text-xs text-[#6B6D5E]">Amount</div>
                        <div className="font-bold text-base text-[#24251F]">
                          ₦{ord.totalAmount.toLocaleString()}
                        </div>
                      </div>

                      {nextStatus && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, nextStatus)}
                          className="px-4 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-bold hover:bg-black transition flex items-center gap-1.5"
                        >
                          <PackageCheck className="w-4 h-4 text-[#D7E7A5]" />
                          <span>Mark {nextStatus.replace(/_/g, " ")}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Live Menu & Price Management */}
        <div className="space-y-4 pt-4 border-t border-[#E2DDD2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#24251F]">
                Menu & Stock Management
              </h2>
              <p className="text-xs text-[#6B6D5E]">
                Toggle real-time item availability or adjust prices as market rates change.
              </p>
            </div>

            <button
              onClick={() => setIsAddingDish(!isAddingDish)}
              className="px-4 py-2 rounded-xl bg-[#A84C35] text-white text-xs font-bold hover:bg-[#803723] transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Add Dish Form */}
          {isAddingDish && (
            <form
              onSubmit={handleCreateDish}
              className="p-6 rounded-2xl border border-[#A84C35]/30 bg-[#FFFFFF] shadow-sm space-y-4 animate-in fade-in duration-200"
            >
              <h3 className="font-serif font-bold text-base text-[#24251F]">
                Add Dish to {currentVendor.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-[#24251F] mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Asun Fried Rice"
                    className="w-full p-2.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#24251F] mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#24251F] mb-1">Category *</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as FoodCategory)}
                    className="w-full p-2.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC]"
                  >
                    <option value="Rice & Grains">Rice & Grains</option>
                    <option value="Swallow & Soups">Swallow & Soups</option>
                    <option value="Beans & Porridge">Beans & Porridge</option>
                    <option value="Pasta & Grills">Pasta & Grills</option>
                    <option value="Snacks & Pastries">Snacks & Pastries</option>
                    <option value="Drinks & Parfait">Drinks & Parfait</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#24251F] mb-1">
                  Description / Portion info
                </label>
                <input
                  type="text"
                  value={newDishDescription}
                  onChange={(e) => setNewDishDescription(e.target.value)}
                  placeholder="e.g. Served with 2 pieces of fried dodo and spicy sauce"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E2DDD2] bg-[#F6F3EC]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDish(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2DDD2] text-xs font-medium text-[#6B6D5E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#24251F] text-white text-xs font-bold hover:bg-black"
                >
                  Save Dish to Menu
                </button>
              </div>
            </form>
          )}

          {/* Menu Items Table / Cards */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2DDD2] overflow-hidden shadow-2xs divide-y divide-[#E2DDD2]">
            {vendorMenuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FBF9F5] transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-[#24251F]">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F6F3EC] text-[#6B6D5E]">
                      {item.categoryName}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6D5E] line-clamp-1">{item.description}</p>
                  <div className="text-[11px] text-[#6B6D5E]">
                    Portion: {item.portionSize} • Prep: {item.prepTimeMinutes} mins
                  </div>
                </div>

                {/* Price & Availability Controls */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Inline Price Edit */}
                  <div>
                    {editingItemId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editPriceValue}
                          onChange={(e) => setEditPriceValue(Number(e.target.value))}
                          className="w-20 p-1.5 rounded-lg border border-[#24251F] text-xs font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditPrice(item.id)}
                          className="px-2 py-1 bg-[#24251F] text-white text-xs rounded-md font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#24251F]">
                          ₦{item.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => startEditPrice(item.id, item.price)}
                          className="p-1 text-[#6B6D5E] hover:text-[#24251F] transition"
                          title="Edit price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Availability Toggle */}
                  <button
                    onClick={() => updateMenuItemAvailability(item.id, !item.isAvailable)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      item.isAvailable
                        ? "bg-[#D7E7A5] text-[#24251F]"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span>{item.isAvailable ? "Available" : "Sold Out"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
