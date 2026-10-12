"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import {
  AlertCircle,
  ArrowRight,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    createOrder,
    selectedInstitution,
  } = useCampus();

  const [studentName, setStudentName] = useState("Tunde Bakare");
  const [studentPhone, setStudentPhone] = useState("0803 456 7890");
  const [pickupOption, setPickupOption] = useState<"counter_pickup" | "hall_dropoff">("counter_pickup");
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_pickup" | "transfer_on_pickup">("cash_on_pickup");
  const [deliveryLocation, setDeliveryLocation] = useState("Tedder Hall, Room B12");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isCartOpen) return null;

  const containerFee = cart.length > 0 ? 100 : 0;
  const deliveryFee = pickupOption === "hall_dropoff" ? 200 : 0;
  const grandTotal = cartTotal + containerFee + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!studentName.trim() || !studentPhone.trim()) {
      setErrorMsg("Please provide your name and phone number for pickup verification.");
      return;
    }

    if (pickupOption === "hall_dropoff" && !deliveryLocation.trim()) {
      setErrorMsg("Please specify your hall name and room number for delivery.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        studentName,
        studentPhone,
        pickupOption,
        paymentMethod,
        deliveryLocation: pickupOption === "hall_dropoff" ? deliveryLocation : undefined,
        specialInstructions,
      });

      if (order) {
        setIsCartOpen(false);
        router.push(`/orders/${order.id}`);
      }
    } catch (err) {
      setErrorMsg("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#E2DDD2] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#E2DDD2] flex items-center justify-between bg-[#F6F3EC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#D7E7A5] text-[#24251F] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h2 id="cart-drawer-title" className="font-serif font-bold text-lg text-[#24251F]">
                  Your Campus Meal Order
                </h2>
                <p className="text-xs text-[#6B6D5E]">
                  {selectedInstitution.shortName} • {cartItemCount} {cartItemCount === 1 ? "dish" : "dishes"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-[#E8D5C0]/50 text-[#6B6D5E] hover:text-[#24251F] transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F6F3EC] border border-[#E2DDD2] flex items-center justify-center text-[#6B6D5E]">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#24251F]">
                    Your tray is empty
                  </h3>
                  <p className="text-xs text-[#6B6D5E] mt-1 max-w-xs">
                    Browse verified cafeteria menus or let our AI Food Finder match meals within your student budget.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-semibold hover:bg-black transition"
                >
                  Explore Campus Menus
                </button>
              </div>
            ) : (
              <>
                {/* Vendor Group Header */}
                <div className="bg-[#FDF3F0] p-3 rounded-xl border border-[#A84C35]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#A84C35]" />
                    <span className="font-medium text-[#24251F]">
                      {cart[0].vendorName}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#A84C35] font-semibold">
                    {cart[0].campusAreaName}
                  </span>
                </div>

                {/* Item List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-[#E2DDD2] bg-[#FFFFFF] flex items-start gap-3 relative hover:border-[#C8C1B2] transition"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[#24251F] truncate">
                          {item.name}
                        </h4>
                        <div className="text-xs text-[#6B6D5E] mt-0.5">
                          {item.portionSize}
                        </div>
                        {item.selectedVariants && item.selectedVariants.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {item.selectedVariants.map((v, idx) => (
                              <div
                                key={idx}
                                className="text-[11px] text-[#A84C35] flex items-center gap-1 font-medium"
                              >
                                <span>+ {v.name}</span>
                                <span>(+₦{v.priceDelta})</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="font-bold text-sm text-[#24251F] mt-2">
                          ₦{item.itemTotal.toLocaleString()}
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="text-[#6B6D5E] hover:text-[#A84C35] p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center border border-[#E2DDD2] rounded-lg overflow-hidden bg-[#F6F3EC]">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="px-2 py-1 hover:bg-[#E8D5C0] text-[#24251F] transition text-xs font-bold"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#24251F]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="px-2 py-1 hover:bg-[#E8D5C0] text-[#24251F] transition text-xs font-bold"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-xs text-[#6B6D5E] hover:text-[#A84C35] underline"
                  >
                    Clear Tray
                  </button>
                </div>

                {/* Pickup & Student Details Form */}
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-[#E2DDD2]">
                  <h4 className="font-serif font-bold text-sm text-[#24251F]">
                    Pickup & Student Details
                  </h4>

                  {/* Pickup vs Delivery Toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPickupOption("counter_pickup")}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                        pickupOption === "counter_pickup"
                          ? "border-[#24251F] bg-[#24251F] text-white"
                          : "border-[#E2DDD2] bg-[#FFFFFF] text-[#24251F] hover:bg-[#F6F3EC]"
                      }`}
                    >
                      <div className="font-bold">Counter Pickup</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Free • Ready in 10m</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickupOption("hall_dropoff")}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                        pickupOption === "hall_dropoff"
                          ? "border-[#24251F] bg-[#24251F] text-white"
                          : "border-[#E2DDD2] bg-[#FFFFFF] text-[#24251F] hover:bg-[#F6F3EC]"
                      }`}
                    >
                      <div className="font-bold">Hall Dropoff</div>
                      <div className="text-[10px] opacity-80 mt-0.5">+₦200 • Hall runner</div>
                    </button>
                  </div>

                  {pickupOption === "hall_dropoff" && (
                    <div>
                      <label className="block text-xs font-medium text-[#24251F] mb-1">
                        Hall Name & Room Number *
                      </label>
                      <input
                        type="text"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        placeholder="e.g. Tedder Hall, Block B, Room 14"
                        className="w-full text-xs p-2.5 rounded-lg border border-[#E2DDD2] focus:outline-hidden focus:border-[#24251F] bg-[#FFFFFF]"
                        required
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#24251F] mb-1">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full text-xs p-2.5 rounded-lg border border-[#E2DDD2] focus:outline-hidden focus:border-[#24251F] bg-[#FFFFFF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#24251F] mb-1">
                        Phone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="080..."
                        className="w-full text-xs p-2.5 rounded-lg border border-[#E2DDD2] focus:outline-hidden focus:border-[#24251F] bg-[#FFFFFF]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#24251F] mb-1">
                      Kitchen Note / Pepper Preference (Optional)
                    </label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Extra hot pepper, no onions"
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E2DDD2] focus:outline-hidden focus:border-[#24251F] bg-[#FFFFFF]"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-medium text-[#24251F] mb-1.5">
                      Payment Verification Mode (Demo Transparent)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash_on_pickup")}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                          paymentMethod === "cash_on_pickup"
                            ? "border-[#A84C35] bg-[#FDF3F0] text-[#A84C35] font-bold"
                            : "border-[#E2DDD2] bg-[#FFFFFF] text-[#6B6D5E]"
                        }`}
                      >
                        Cash on Pickup
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("transfer_on_pickup")}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                          paymentMethod === "transfer_on_pickup"
                            ? "border-[#A84C35] bg-[#FDF3F0] text-[#A84C35] font-bold"
                            : "border-[#E2DDD2] bg-[#FFFFFF] text-[#6B6D5E]"
                        }`}
                      >
                        Bank Transfer on Pickup
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Footer & Totals */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E2DDD2] bg-[#F6F3EC] space-y-3">
              <div className="space-y-1.5 text-xs text-[#6B6D5E]">
                <div className="flex justify-between">
                  <span>Food Subtotal</span>
                  <span className="font-semibold text-[#24251F]">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Takeaway Pack</span>
                  <span className="font-semibold text-[#24251F]">
                    ₦{containerFee}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Campus Hall Delivery</span>
                    <span className="font-semibold text-[#24251F]">
                      ₦{deliveryFee}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#24251F] pt-2 border-t border-[#E2DDD2]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#A84C35]">
                    ₦{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#6B6D5E]">
                <Clock className="w-3.5 h-3.5 text-[#3E5A17]" />
                <span>Zero queueing. Kitchen begins prep immediately upon confirmation.</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#24251F] text-white font-semibold text-sm hover:bg-black transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? "Generating Token..." : "Confirm & Get Pickup Token"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
