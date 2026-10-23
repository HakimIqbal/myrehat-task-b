"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@myrehat-task-b/ui/components/card";
import { Skeleton } from "@myrehat-task-b/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Building,
  Calendar,
  Compass,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Star,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { orpc } from "@/utils/orpc";

const CATEGORIES = [
  "All Opportunities",
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

type FilterCategory = (typeof CATEGORIES)[number];

const CATEGORY_IMAGES: Record<string, string> = {
  "Buy Property":
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  "Buy land to build homestay":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  "Buy Airbnb Profile":
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "Buy Airbnb Business":
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
};

interface SampleListing {
  id: string;
  title: string;
  category: string;
  location: string;
  price: string;
  image: string;
  rating: number;
}

const SAMPLE_OPPORTUNITIES: SampleListing[] = [
  {
    id: "sample-1",
    title: "Cameron Valley Tea Villa",
    category: "Buy Property",
    location: "Cameron Highlands, Pahang",
    price: "RM 350,000",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
  },
  {
    id: "sample-2",
    title: "Langkawi Sunset Eco Land",
    category: "Buy land to build homestay",
    location: "Padang Matsirat, Langkawi",
    price: "RM 180,000",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
  },
  {
    id: "sample-3",
    title: "KLCC Skyline Superhost Asset",
    category: "Buy Airbnb Profile",
    location: "KLCC, Kuala Lumpur",
    price: "RM 45,000",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
  },
];

function formatWhatsAppLink(phone: string, title: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    `Hello! I am interested in your MyRehat listing: "${title}". Can you share more details?`,
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
}

function formatPrice(price: string | number) {
  const num = Number(price);
  if (isNaN(num)) return `RM ${price}`;
  return `RM ${num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

interface HomestayListProps {
  onNavigateToCreate?: () => void;
}

export default function HomestayList({ onNavigateToCreate }: HomestayListProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All Opportunities");

  const { data: listings, isLoading, error } = useQuery(orpc.homestays.list.queryOptions());

  const filteredListings = useMemo(() => {
    if (!listings) return [];
    return listings.filter((item) => {
      const matchesCategory =
        selectedCategory === "All Opportunities" || item.category === selectedCategory;
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
    <div className="space-y-8">
      {/* 2. Structured 2-Tier Search and Category Filter Bar */}
      <div className="space-y-3">
        {/* Tier 1: Search Input Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, location, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-10 text-sm rounded-full border border-border/60 bg-background shadow-xs transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-ring"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Tier 2: Category Strip with Counter Badge */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-xs"
                    : "bg-background text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <span>{cat}</span>
                {isSelected && !isLoading && (
                  <span className="inline-flex items-center justify-center rounded-full bg-background/20 px-1.5 py-0.2 text-[10px] font-bold text-background leading-none">
                    {filteredListings.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden rounded-2xl border-border/50 shadow-xs">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="pt-2 border-t border-border/40">
                  <Skeleton className="h-8 w-full rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-center text-xs text-destructive">
          Failed to load marketplace listings: {(error as any)?.message || "Unknown error"}
        </div>
      )}

      {/* 3. Human-Centric Empty State Card & Sample Opportunities */}
      {!isLoading && !error && filteredListings.length === 0 && (
        <div className="space-y-12">
          {/* Main Empty State Container */}
          <div className="rounded-2xl border border-border/50 bg-muted/20 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border/50 bg-background text-muted-foreground shadow-2xs">
              <Building className="size-6 text-foreground/70" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                No Listings Published in this Category Yet
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Be the first verified host or property owner to list a villa, land, or operating Airbnb business directly to buyers with 0% platform fee.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onNavigateToCreate ? (
                <button
                  type="button"
                  onClick={onNavigateToCreate}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 shadow-sm cursor-pointer w-full sm:w-auto"
                >
                  <Plus className="size-4" />
                  Post the First Listing
                </button>
              ) : null}

              {(search || selectedCategory !== "All Opportunities") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All Opportunities");
                  }}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer py-2"
                >
                  Reset active filters
                </button>
              )}
            </div>
          </div>

          {/* Sample Verified Opportunities Showcase */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Compass className="size-3.5" />
                Sample Verified Opportunities
              </div>
              <p className="text-xs text-muted-foreground">
                Reference examples of properties, development land, and turnkey businesses traded on MyRehat.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SAMPLE_OPPORTUNITIES.map((sample) => (
                <Card
                  key={sample.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border-border/60 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <img
                      src={sample.image}
                      alt={sample.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-background/85 border border-border/40 shadow-xs text-foreground">
                      {sample.category}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md bg-background/90 text-muted-foreground border border-border/40">
                      Sample Preview
                    </span>
                  </div>

                  <CardHeader className="space-y-1.5 p-4 pb-2">
                    <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
                      {sample.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 line-clamp-1">
                        <MapPin className="size-3.5 shrink-0 text-muted-foreground/80" />
                        {sample.location}
                      </span>
                      <span className="inline-flex items-center gap-0.5 font-semibold text-foreground shrink-0">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {sample.rating.toFixed(2)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardFooter className="p-4 pt-0 space-y-2.5 flex-col items-stretch">
                    <div className="pt-2 border-t border-border/40 flex items-baseline justify-between">
                      <span className="text-lg font-bold tracking-tight text-foreground">
                        {sample.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="h-8 px-3 rounded-full text-xs font-medium border border-border/50 bg-muted/30 text-muted-foreground flex items-center justify-center gap-1.5 w-full cursor-not-allowed opacity-80"
                    >
                      <MessageSquare className="size-3.5" />
                      Sample Opportunity
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Real Listings Cards Grid */}
      {!isLoading && !error && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((item) => {
            const waLink = formatWhatsAppLink(item.contactWa, item.title);
            const imageUrl =
              CATEGORY_IMAGES[item.category] ||
              "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80";

            return (
              <Card
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border-border/60 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
              >
                {/* Visual Cover with Floating Badge */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-background/85 border border-border/40 shadow-xs text-foreground">
                    {item.category}
                  </span>
                </div>

                {/* Card Content */}
                <CardHeader className="space-y-1.5 p-4 pb-2">
                  <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground/80" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between border-t border-border/40 pt-2.5 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="size-3" />
                      {item.user?.name || "Verified Host"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(item.createdAt).toLocaleDateString("en-MY", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 space-y-2.5 flex-col items-stretch">
                  <div className="pt-2 border-t border-border/40 flex items-baseline justify-between">
                    <span className="text-lg font-bold tracking-tight text-foreground">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* Refined Sleek Pill Contact Button */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 rounded-full text-xs font-medium border border-border/70 hover:bg-foreground hover:text-background hover:border-foreground transition-all flex items-center justify-center gap-1.5 w-full cursor-pointer"
                  >
                    <MessageSquare className="size-3.5" />
                    Contact Host
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
