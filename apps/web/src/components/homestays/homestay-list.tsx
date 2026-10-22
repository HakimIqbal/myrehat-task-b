"use client";

import { buttonVariants } from "@myrehat-task-b/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@myrehat-task-b/ui/components/card";
import { Input } from "@myrehat-task-b/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Building,
  Calendar,
  ExternalLink,
  Filter,
  LandPlot,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

import { orpc } from "@/utils/orpc";

const CATEGORIES = [
  "All",
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

type FilterCategory = (typeof CATEGORIES)[number];

function getCategoryBadge(category: string) {
  switch (category) {
    case "Buy Property":
      return {
        icon: Building,
        className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case "Buy land to build homestay":
      return {
        icon: LandPlot,
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "Buy Airbnb Profile":
      return {
        icon: User,
        className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    case "Buy Airbnb Business":
      return {
        icon: Briefcase,
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    default:
      return {
        icon: Building,
        className: "bg-muted text-muted-foreground border-border",
      };
  }
}

function formatWhatsAppLink(phone: string, title: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    `Hello! I am interested in your MyRehat listing: "${title}". Can you share more details?`,
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
}

function formatPrice(price: string | number) {
  const num = Number(price);
  if (isNaN(num)) return price;
  return `RM ${num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default function HomestayList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All");

  const { data: listings, isLoading, error } = useQuery(orpc.homestays.list.queryOptions());

  const filteredListings = useMemo(() => {
    if (!listings) return [];
    return listings.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [listings, selectedCategory, search]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="mr-1 size-3.5 text-muted-foreground" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                selectedCategory === cat
                  ? "border-primary bg-primary text-primary-foreground font-medium"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mb-2 size-8 animate-spin text-primary" />
          <p className="text-sm">Loading BuyHomestay listings...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded border border-destructive/50 bg-destructive/10 p-4 text-center text-xs text-destructive">
          Failed to load listings: {(error as any)?.message || "Unknown error"}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredListings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <Building className="mb-3 size-10 text-muted-foreground/60" />
          <h3 className="text-sm font-semibold">No listings found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {search || selectedCategory !== "All"
              ? "No BuyHomestay listings match your current filters. Try resetting the search or category."
              : "Be the first one to create a BuyHomestay listing using the form!"}
          </p>
        </div>
      )}

      {/* Listings Cards Grid */}
      {!isLoading && !error && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((item) => {
            const badge = getCategoryBadge(item.category);
            const BadgeIcon = badge.icon;
            const waLink = formatWhatsAppLink(item.contactWa, item.title);

            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.className}`}
                    >
                      <BadgeIcon className="size-3" />
                      {item.category}
                    </span>
                    <span className="text-base font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <CardTitle className="line-clamp-2 text-sm leading-snug">
                    {item.title}
                  </CardTitle>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 text-xs text-muted-foreground pt-0">
                  <div className="flex items-center justify-between border-t pt-2 text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="size-3" />
                      {item.user?.name || "Verified Seller"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className:
                        "w-full gap-1.5 text-xs font-medium hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30 dark:hover:text-emerald-400",
                    })}
                  >
                    <MessageCircle className="size-3.5 text-emerald-500" />
                    WhatsApp Seller ({item.contactWa})
                    <ExternalLink className="size-3 opacity-60 ml-auto" />
                  </a>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

