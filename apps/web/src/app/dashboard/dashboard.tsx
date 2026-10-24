"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@myrehat-task-b/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Building2,
  MessageCircle,
  Plus,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import HomestayForm from "@/components/homestays/homestay-form";
import HomestayList from "@/components/homestays/homestay-list";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const privateData = useQuery(orpc.privateData.queryOptions());
  const listingsQuery = useQuery(orpc.homestays.list.queryOptions());

  const allListings = listingsQuery.data || [];
  const myListings = allListings.filter((item) => item.userId === session.user.id);

  return (
    <div className="space-y-8">
      {/* Header Profile Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Host Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome, <strong className="font-semibold text-foreground">{session.user.name}</strong> &middot; {session.user.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-medium transition-all cursor-pointer shadow-2xs ${
              showCreateForm
                ? "border border-border/60 bg-background text-foreground hover:bg-muted"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            <Plus className="size-3.5" />
            {showCreateForm ? "Close Form" : "Post New Listing"}
          </button>
          <Link
            href="/homestays"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-background px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Building2 className="size-3.5 text-muted-foreground" />
            Marketplace
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Card 1: Total Market Listings */}
        <Card className="rounded-2xl border border-border/50 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Market Listings</CardTitle>
            <Building2 className="size-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {listingsQuery.isLoading ? "..." : allListings.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Across all categories
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Your Listings */}
        <Card className="rounded-2xl border border-border/50 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Your Listings</CardTitle>
            <Briefcase className="size-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {listingsQuery.isLoading ? "..." : myListings.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active published by you
            </p>
          </CardContent>
        </Card>

        {/* Card 3: WhatsApp Direct Inquiries */}
        <Card className="rounded-2xl border border-border/50 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Direct Inquiries</CardTitle>
            <MessageCircle className="size-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              100%
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              WhatsApp &middot; 0% platform fee
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Auth Session & Protected API */}
        <Card className="rounded-2xl border border-border/50 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Security Guard</CardTitle>
            <ShieldCheck className="size-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-foreground truncate">
              {privateData.isLoading ? "Validating..." : "Protected"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              Better-Auth session active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Listing Creation Modal */}
      {showCreateForm && (
        <HomestayForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}

      {/* Host AI Concierge Banner */}
      <Card className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Bot className="size-3.5 text-muted-foreground" />
              MyRehat AI Concierge
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Automate guest messaging & WhatsApp inquiries
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              WAHA-compatible webhook triage to instantly answer booking questions, explain amenities, and assist guests.
            </p>
          </div>
          <Link
            href="/ai"
            className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90 shadow-2xs self-start sm:self-auto shrink-0"
          >
            Launch Concierge
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </div>
      </Card>

      {/* Marketplace Listings Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Marketplace Opportunities
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time feed of all active BuyHomestay listings available for acquisition.
            </p>
          </div>
        </div>
        <HomestayList />
      </div>
    </div>
  );
}
