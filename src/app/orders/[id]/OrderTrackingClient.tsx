"use client";

import React, { useSyncExternalStore } from "react";
import { useCampus } from "@/context/CampusContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrderStatus } from "@/types/campus";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Receipt,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import Link from "next/link";

const emptySubscribe = () => () => {};

export function OrderTrackingClient({ orderId }: { orderId: string }) {
  const { orders, vendors, selectedInstitution } = useCampus();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const order = orders.find((o) => o.id === orderId);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full border-3 border-[#A84C35] border-t-transparent animate-spin mb-4" />
          <h2 className="font-serif font-bold text-xl text-[#24251F]">Loading Order Token...</h2>
          <p className="text-xs text-[#6B6D5E] mt-1">Synchronizing live campus kitchen status.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 sm:px-6 py-20 w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FDF3F0] flex items-center justify-center text-[#A84C35]">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif font-black text-2xl text-[#24251F]">Order Not Found</h1>
            <p className="text-sm text-[#6B6D5E]">
              We couldn&apos;t find an active pickup token for reference{" "}
              <span className="font-mono font-bold text-[#24251F]">#{orderId}</span> in your session.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/my-campus"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#24251F] text-white text-xs font-bold hover:bg-black transition"
            >
              View My Orders
            </Link>
            <Link
              href="/discover"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-[#E2DDD2] text-[#24251F] text-xs font-bold hover:bg-[#F6F3EC] transition"
            >
              Browse Cafeterias
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const vendor = vendors.find((v) => v.id === order.vendorId);

  const statusSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: "pending", label: "Order Submitted", desc: "Sent to cafeteria counter" },
    { key: "accepted", label: "Kitchen Accepted", desc: "Order acknowledged by vendor" },
    { key: "preparing", label: "Cooking / Assembling", desc: "Food on fire / in the wok" },
    { key: "ready_for_pickup", label: "Ready for Pickup", desc: "Warm at cafeteria counter" },
    { key: "completed", label: "Picked Up / Completed", desc: "Meal received" },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/my-campus"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6D5E] hover:text-[#24251F] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Orders</span>
          </Link>
        </div>

        {/* Live Token Ticket Box */}
        <div className="relative rounded-3xl border border-[#E2DDD2] bg-[#FFFFFF] overflow-hidden shadow-md">
          {/* Top Ticket Header */}
          <div className="bg-[#24251F] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#D7E7A5]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#D7E7A5]">
                  Student Campus Pickup Token
                </span>
              </div>
              <h1 className="font-serif font-black text-3xl sm:text-4xl tracking-tight">
                {order.tokenCode}
              </h1>
              <p className="text-xs text-white/70">
                Show this token at the cafeteria counter to skip the queue.
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-white/70">Order Reference</div>
              <div className="font-mono font-bold text-sm text-white">
                {order.orderNumber}
              </div>
              <div className="text-[11px] text-[#D7E7A5] font-semibold mt-1">
                {selectedInstitution.name}
              </div>
            </div>
          </div>

          {/* Stepper Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Live Progress Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#24251F]">
                  Live Preparation Status
                </h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF3F0] text-[#A84C35] uppercase tracking-wider">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? "border-[#A84C35] bg-[#FDF3F0] ring-1 ring-[#A84C35]/30"
                          : isDone
                          ? "border-[#D7E7A5] bg-[#F3F8E5]"
                          : "border-[#E2DDD2] bg-[#FFFFFF] opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5A17]" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-400" />
                        )}
                        <span className="font-bold text-[11px] text-[#24251F]">
                          {step.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6B6D5E] leading-tight">
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vendor Pickup Point Card */}
            <div className="p-5 rounded-2xl bg-[#F6F3EC] border border-[#E2DDD2] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#A84C35] uppercase tracking-wider">
                  Pickup Location & Directions
                </div>
                <div className="font-serif font-bold text-base text-[#24251F]">
                  {order.vendorName}
                </div>
                <div className="text-xs text-[#6B6D5E] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A84C35] shrink-0" />
                  <span>{order.campusAreaName} • {vendor?.verifiedAddress || "Campus Cafeteria"}</span>
                </div>
                {vendor?.pickupInstructions && (
                  <div className="text-xs text-[#24251F] mt-2 pt-2 border-t border-[#E2DDD2]">
                    <strong>Instructions:</strong> {vendor.pickupInstructions}
                  </div>
                )}
              </div>

              {/* Vendor Phone / Contact */}
              {vendor && (
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${vendor.contactPhone}`}
                    className="p-2.5 rounded-xl bg-white border border-[#E2DDD2] hover:bg-[#FDF3F0] text-[#24251F] text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Counter</span>
                  </a>
                  {vendor.whatsappNumber && (
                    <a
                      href={`https://wa.me/${vendor.whatsappNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#24251F] text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Itemized Receipt Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#E2DDD2]">
              <h4 className="font-serif font-bold text-sm text-[#24251F] flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#6B6D5E]" />
                <span>Order Summary</span>
              </h4>

              <div className="rounded-xl border border-[#E2DDD2] overflow-hidden divide-y divide-[#E2DDD2] text-xs">
                {order.items.map((it, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#24251F]">
                        {it.quantity}x {it.name}
                      </div>
                      {it.selectedVariants && it.selectedVariants.length > 0 && (
                        <div className="text-[11px] text-[#A84C35]">
                          {it.selectedVariants.map((v) => `+ ${v.name}`).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-[#24251F]">
                      ₦{it.itemTotal.toLocaleString()}
                    </div>
                  </div>
                ))}

                <div className="p-3.5 bg-[#F6F3EC] space-y-1.5 text-[11px] text-[#6B6D5E]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#24251F]">₦{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Takeaway Container</span>
                    <span className="font-medium text-[#24251F]">₦{order.containerFee}</span>
                  </div>
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Hall Delivery</span>
                      <span className="font-medium text-[#24251F]">₦{order.deliveryFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#24251F] pt-2 border-t border-[#E2DDD2]">
                    <span>Total Paid / Due on Pickup</span>
                    <span className="text-[#A84C35]">₦{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Checkout Disclaimer */}
            <div className="p-3.5 rounded-xl bg-[#F6F3EC] border border-[#E2DDD2] text-[11px] text-[#6B6D5E] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3E5A17] shrink-0" />
              <span>
                Simulated transparent campus checkout. Pay via cash or bank transfer directly at the cafeteria counter when picking up your food.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
