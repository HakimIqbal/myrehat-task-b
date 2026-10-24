"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

export const CATEGORIES = [
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

export type Category = (typeof CATEGORIES)[number];

const CATEGORY_OPTIONS: {
  category: Category;
  title: string;
  description: string;
}[] = [
  {
    category: "Buy Property",
    title: "Buy Property",
    description: "Turnkey furnished villa or residential home ready for guests",
  },
  {
    category: "Buy land to build homestay",
    title: "Buy land to build homestay",
    description: "Strategic land parcel with permits for villa development",
  },
  {
    category: "Buy Airbnb Profile",
    title: "Buy Airbnb Profile",
    description: "Established Superhost account with ratings and history",
  },
  {
    category: "Buy Airbnb Business",
    title: "Buy Airbnb Business",
    description: "Operational company with master leases and active cash flow",
  },
];

export interface HomestayFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  embedded?: boolean;
}

export default function HomestayForm({
  isOpen = true,
  onClose,
  onSuccess,
  embedded = false,
}: HomestayFormProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<Category>("Buy Property");
  const [contactWa, setContactWa] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Esc key and body scroll lock
  useEffect(() => {
    if (!isOpen || embedded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, embedded, onClose]);

  const createMutation = useMutation({
    ...orpc.homestays.create.mutationOptions(),
    onSuccess: () => {
      toast.success("Listing published successfully to the marketplace!");
      setTitle("");
      setPrice("");
      setLocation("");
      setCategory("Buy Property");
      setContactWa("");
      setFormError(null);
      queryClient.invalidateQueries({
        queryKey: orpc.homestays.list.queryKey(),
      });
      onSuccess?.();
      onClose?.();
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to create listing. Please check your inputs.";
      setFormError(message);
      toast.error(message);
    },
  });

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Listing title is required");
      return;
    }
    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setFormError("Please enter a valid positive price (MYR)");
      return;
    }
    if (!location.trim()) {
      setFormError("Location is required");
      return;
    }
    if (!CATEGORIES.includes(category)) {
      setFormError("Selected category is invalid");
      return;
    }
    if (!contactWa.trim()) {
      setFormError("WhatsApp contact number is required");
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      price: numPrice,
      location: location.trim(),
      category,
      contactWa: contactWa.trim(),
    });
  };

  const formBody = (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="max-h-[calc(85vh-8rem)] overflow-y-auto px-6 py-5 sm:px-8 space-y-5">
            {formError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* 1. Listing Title */}
            <div>
              <label
                htmlFor="homestay-title"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Listing Title
              </label>
              <input
                id="homestay-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 4-Bedroom Scandinavian Villa with Infinity Pool"
                disabled={createMutation.isPending}
                required
                className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground shadow-2xs placeholder:text-muted-foreground/45 transition-all focus:border-foreground focus:ring-1 focus:ring-foreground outline-none"
              />
            </div>

            {/* Price (MYR) & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 2. Price (MYR) */}
              <div>
                <label
                  htmlFor="homestay-price"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Price (MYR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground select-none pointer-events-none">
                    RM
                  </span>
                  <input
                    id="homestay-price"
                    type="number"
                    min="1"
                    step="any"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="350000"
                    disabled={createMutation.isPending}
                    required
                    className="h-11 w-full rounded-xl border border-border/80 bg-background pl-10 pr-3.5 text-sm text-foreground shadow-2xs placeholder:text-muted-foreground/45 transition-all focus:border-foreground focus:ring-1 focus:ring-foreground outline-none"
                  />
                </div>
              </div>

              {/* 3. Location */}
              <div>
                <label
                  htmlFor="homestay-location"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Location
                </label>
                <input
                  id="homestay-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Cameron Highlands, Pahang"
                  disabled={createMutation.isPending}
                  required
                  className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground shadow-2xs placeholder:text-muted-foreground/45 transition-all focus:border-foreground focus:ring-1 focus:ring-foreground outline-none"
                />
              </div>
            </div>

            {/* 4. Listing Category: Grid 4 Kartu Pilihan */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Listing Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORY_OPTIONS.map((item) => {
                  const isSelected = category === item.category;
                  return (
                    <button
                      key={item.category}
                      type="button"
                      onClick={() => setCategory(item.category)}
                      disabled={createMutation.isPending}
                      className={`cursor-pointer rounded-2xl p-3.5 transition-all text-left ${
                        isSelected
                          ? "border-2 border-foreground bg-foreground/5 shadow-xs"
                          : "border border-border/70 bg-background hover:border-foreground/40 hover:bg-muted/20"
                      }`}
                    >
                      <div className="text-xs font-bold text-foreground">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {item.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. WhatsApp Contact Number */}
            <div>
              <label
                htmlFor="homestay-contactWa"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                WhatsApp Contact Number
              </label>
              <input
                id="homestay-contactWa"
                type="text"
                value={contactWa}
                onChange={(e) => setContactWa(e.target.value)}
                placeholder="+60 12 345 6789 atau 60123456789"
                disabled={createMutation.isPending}
                required
                className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground shadow-2xs placeholder:text-muted-foreground/45 transition-all focus:border-foreground focus:ring-1 focus:ring-foreground outline-none"
              />
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="border-t border-border/40 px-6 py-4 sm:px-8 flex items-center justify-end gap-3 bg-muted/10 shrink-0">
            <button
              type="button"
              onClick={() => onClose?.()}
              disabled={createMutation.isPending}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-3 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="h-11 px-7 rounded-full bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white font-semibold text-xs tracking-wide shadow-sm hover:opacity-95 active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Publishing Listing...
                </>
              ) : (
                "Publish Listing"
              )}
            </button>
          </div>
        </form>
  );

  if (embedded) {
    return formBody;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Post a BuyHomestay Listing"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl border border-border/40 bg-background shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="border-b border-border/40 px-6 py-4 sm:px-8 shrink-0">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Post a BuyHomestay Listing
          </h2>
          <p className="text-xs text-muted-foreground">
            Submit your vacation home, development plot, or Airbnb business to verified buyers.
          </p>
        </div>

        {formBody}
      </div>
    </div>,
    document.body,
  );
}
