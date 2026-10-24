"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bot,
  Building,
  CheckCircle2,
  ExternalLink,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import HomestayForm from "@/components/homestays/homestay-form";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

function formatPrice(price: string | number) {
  const num = Number(price);
  if (isNaN(num)) return `RM ${price}`;
  return `RM ${num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function formatWhatsAppLink(phone: string, title: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    `Hello! I am interested in your MyRehat listing: "${title}". Can you share more details?`
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
}

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const listingsQuery = useQuery(orpc.homestays.list.queryOptions());

  const allListings = listingsQuery.data || [];
  const myListings = allListings.filter((item) => item.userId === session.user.id);

  return (
    <div className="space-y-8">
      {/* 1. Header Host Hub — Clean & Professional */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Host Hub
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              Verified Host
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome back, <strong className="font-semibold text-foreground">{session.user.name}</strong> ({session.user.email})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] px-4 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-95 cursor-pointer"
          >
            <Plus className="size-3.5" />
            Post New Opportunity
          </button>
          <Link
            href="/homestays"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 bg-background px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted/70"
          >
            <Building className="size-3.5 text-muted-foreground" />
            Browse Marketplace
          </Link>
        </div>
      </div>

      {/* 2. Stat Cards Grid — Micro-Typography & Real Value */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
        {/* Stat 1 */}
        <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Your Listings</span>
            <Building className="size-4 text-muted-foreground/70" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {listingsQuery.isLoading ? "..." : myListings.length}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Active opportunities published
          </p>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Marketplace Total</span>
            <TrendingUp className="size-4 text-muted-foreground/70" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {listingsQuery.isLoading ? "..." : allListings.length}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Across 4 BuyHomestay categories
          </p>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">WhatsApp Direct</span>
            <MessageCircle className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            100%
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            0% platform commission fee
          </p>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">AI Concierge</span>
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            Active
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            24/7 guest triage ready
          </p>
        </div>
      </div>

      {/* 3. Host AI Concierge Banner — Sleek & Refined */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted/30 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E61E4D]">
              <Sparkles className="size-3.5" />
              MyRehat 24/7 AI Concierge
            </div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Automated Property &amp; Guest Inquiry Advisor
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Your automated assistant is active to triage inquiries via WhatsApp webhook and interactive web chat.
            </p>
          </div>
          <Link
            href="/ai"
            className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90 shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <Bot className="mr-1.5 size-3.5" />
            Open Concierge Chat
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Your Managed Listings Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Your Managed Listings
            </h2>
            <p className="text-xs text-muted-foreground">
              Opportunities created and maintained under your host account.
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {myListings.length} {myListings.length === 1 ? "Listing" : "Listings"}
          </span>
        </div>

        {myListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-10 text-center">
            <Building className="size-8 text-muted-foreground/40 mb-3" />
            <h3 className="text-sm font-semibold text-foreground">No listings yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              You haven&apos;t published any BuyHomestay opportunities. Post your first listing to start receiving direct WhatsApp buyer inquiries.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-medium text-background hover:opacity-90 cursor-pointer"
            >
              <Plus className="size-3.5" />
              Create First Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xs hover:border-foreground/20 transition-all"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-xs shadow-2xs">
                    {item.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                    Live
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <MapPin className="mr-1 size-3.5 shrink-0 text-muted-foreground/70" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between border-t border-border/40 pt-3">
                    <div className="text-base font-bold text-foreground">
                      {formatPrice(item.price)}
                    </div>
                    <span className="text-[11px] text-muted-foreground">Host Direct</span>
                  </div>

                  <div className="mt-3 pt-1">
                    <a
                      href={formatWhatsAppLink(item.contactWa, item.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8.5 w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 transition-colors"
                    >
                      <MessageCircle className="size-3.5" />
                      Test WhatsApp Link
                      <ExternalLink className="size-3 opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Modal Popup Dialog Post New Opportunity — Airbnb Luxury Pattern */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/60 bg-background p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Create BuyHomestay Opportunity
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Publish a new acquisition listing directly to the public marketplace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/70 hover:text-foreground cursor-pointer transition-colors"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            <HomestayForm
              embedded
              onSuccess={() => setShowCreateModal(false)}
              onClose={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
