"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { useAuthModal } from "@/components/auth-modal";
import HomestayForm from "@/components/homestays/homestay-form";
import HomestayList from "@/components/homestays/homestay-list";
import { authClient } from "@/lib/auth-client";

export default function HomestaysPage() {
  const { data: session } = authClient.useSession();
  const { openAuthModal } = useAuthModal();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handlePostListingClick = () => {
    if (!session?.user) {
      openAuthModal();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-8">
      {/* 1. Header & Action Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            BuyHomestay Marketplace
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Acquire verified vacation stays, land, and turnkey Airbnb businesses across Malaysia.
          </p>
        </div>

        {/* Action Button: + Post Listing */}
        <button
          type="button"
          onClick={handlePostListingClick}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>Post Listing</span>
        </button>
      </div>

      {/* Main Content Body: Always Displays Catalog Listing */}
      <div className="space-y-6">
        <HomestayList onNavigateToCreate={handlePostListingClick} />
      </div>

      {/* Floating Pop-up Modal Form */}
      {isCreateModalOpen && (
        <HomestayForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}
