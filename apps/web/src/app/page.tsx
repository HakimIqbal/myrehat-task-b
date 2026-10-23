"use client";

import {
  ArrowRight,
  Building,
  MapPin,
  MessageSquare,
  Search,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All",
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

type Category = (typeof CATEGORIES)[number];

interface CuratedListing {
  id: string;
  title: string;
  price: string;
  location: string;
  category: Category;
  rating: number;
  image: string;
  waNumber: string;
}

const CURATED_LISTINGS: CuratedListing[] = [
  {
    id: "1",
    title: "Cameron Valley Tea Villa",
    price: "RM 350,000",
    location: "Cameron Highlands, Pahang",
    category: "Buy Property",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    waNumber: "60123456789",
  },
  {
    id: "2",
    title: "Langkawi Sunset Eco Land",
    price: "RM 180,000",
    location: "Padang Matsirat, Langkawi",
    category: "Buy land to build homestay",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    waNumber: "60123456789",
  },
  {
    id: "3",
    title: "KLCC Skyline Superhost Asset",
    price: "RM 45,000",
    location: "KLCC, Kuala Lumpur",
    category: "Buy Airbnb Profile",
    rating: 4.95,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    waNumber: "60123456789",
  },
  {
    id: "4",
    title: "Georgetown Heritage Shophouse",
    price: "RM 520,000",
    location: "Georgetown, Penang",
    category: "Buy Airbnb Business",
    rating: 4.88,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    waNumber: "60123456789",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredListings = useMemo(() => {
    return CURATED_LISTINGS.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 space-y-10 overflow-x-hidden">
      {/* 1. Hero Section - EXACT F4 HEADING */}
      <section className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
          Book homestays directly with hosts
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Direct deals with verified homestay hosts and property owners across Malaysia.
        </p>
      </section>

      {/* 2. Airbnb-Style Minimalist Search Box & Category Pills */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location, property, or city..."
            className="w-full h-11 pl-11 pr-4 text-sm rounded-full border border-border/60 bg-background shadow-xs transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
          />
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer border ${
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-xs"
                    : "bg-background text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Real Curated Listings Grid */}
      <section className="space-y-5">
        <div className="border-b border-border/40 pb-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Featured Opportunities
          </h2>
          <p className="text-xs text-muted-foreground">
            Verified homestay acquisitions and operating Airbnb assets
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border/70 bg-muted/20 space-y-2">
            <Building className="size-8 mx-auto text-muted-foreground/50" />
            <p className="text-sm font-medium text-foreground">No listings match your search</p>
            <p className="text-xs text-muted-foreground">
              Try selecting &quot;All&quot; or clearing your keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredListings.map((listing) => {
              const waText = encodeURIComponent(
                `Hi, I'm interested in "${listing.title}" (${listing.category}) in ${listing.location} listed on MyRehat.`,
              );
              const waUrl = `https://wa.me/${listing.waNumber}?text=${waText}`;

              return (
                <div
                  key={listing.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
                >
                  {/* Photo Preview with Floating Badge */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-background/85 border border-border/40 shadow-xs text-foreground">
                      {listing.category}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3 text-muted-foreground/80 shrink-0" />
                          <span className="font-medium text-foreground/80 line-clamp-1">
                            {listing.location}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-0.5 font-semibold text-foreground shrink-0">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {listing.rating.toFixed(2)}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-foreground line-clamp-1 leading-snug group-hover:text-foreground/90">
                        {listing.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-border/40 space-y-2.5">
                      <div>
                        <span className="text-lg font-bold text-foreground tracking-tight">
                          {listing.price}
                        </span>
                      </div>

                      {/* Direct WhatsApp Action Button (Refined Sleek Pill) */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-3 rounded-full text-xs font-medium border border-border/70 hover:bg-foreground hover:text-background hover:border-foreground transition-all flex items-center justify-center gap-1.5 w-full cursor-pointer"
                      >
                        <MessageSquare className="size-3.5" />
                        Contact Host
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Weighted Solid Center CTA Button */}
      <section className="flex justify-center pt-4 pb-2">
        <Link
          href="/homestays"
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-all hover:bg-foreground/90 shadow-sm group cursor-pointer"
        >
          Explore Full BuyHomestay Marketplace
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}
