"use client";

import { Button } from "@myrehat-task-b/ui/components/button";
import { Building2, Plus, Sparkles } from "lucide-react";
import { useState } from "react";

import HomestayForm from "@/components/homestays/homestay-form";
import HomestayList from "@/components/homestays/homestay-list";

export default function HomestaysPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "create">("browse");

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="size-3.5" />
            MyRehat Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            BuyHomestay Listings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Explore and invest in homestay properties, development land, active Airbnb profiles, and profitable hospitality businesses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={activeTab === "browse" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("browse")}
            className="text-xs"
          >
            <Building2 className="mr-1.5 size-3.5" />
            Browse Listings
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("create")}
            className="text-xs"
          >
            <Plus className="mr-1.5 size-3.5" />
            Post New Listing
          </Button>
        </div>
      </div>

      {/* Main Content Body */}
      {activeTab === "create" ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Post a BuyHomestay Listing</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("browse")}
              className="text-xs text-muted-foreground"
            >
              Cancel & Return to Listings
            </Button>
          </div>
          <HomestayForm onSuccess={() => setActiveTab("browse")} />
        </div>
      ) : (
        <div className="space-y-6">
          <HomestayList />
        </div>
      )}
    </div>
  );
}

