"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";

import HomestayForm from "@/components/homestays/homestay-form";
import HomestayList from "@/components/homestays/homestay-list";

export default function HomestaysPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "create">("browse");

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-8">
      {/* 1. Header & Ergonomic Segmented Control Switcher */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            BuyHomestay Marketplace
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Acquire verified vacation stays, land, and turnkey Airbnb businesses across Malaysia.
          </p>
        </div>

        {/* Segmented Control Pills */}
        <div className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/60 p-1 shrink-0 self-start sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("browse")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "browse"
                ? "bg-background text-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Browse Opportunities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "create"
                ? "bg-background text-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Plus className="size-3.5" />
            Post Listing
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {activeTab === "create" ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setActiveTab("browse")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Back to opportunities
          </button>
          <div className="w-full">
            <HomestayForm onSuccess={() => setActiveTab("browse")} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <HomestayList onNavigateToCreate={() => setActiveTab("create")} />
        </div>
      )}
    </div>
  );
}
