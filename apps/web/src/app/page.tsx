"use client";

import { buttonVariants } from "@myrehat-task-b/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@myrehat-task-b/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Home as HomeIcon,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { orpc } from "@/utils/orpc";

export default function Home() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16 space-y-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          Direct Vacation & Homestay Marketplace
        </div>

        {/* Mandatory exact heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] break-words max-w-full">
          Book homestays directly with hosts
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl px-2">
          Connect directly with verified property owners for vacation stays,
          homestay investments, active Airbnb profiles, and turnkey hospitality
          businesses across Malaysia — zero hidden agent markups.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
          <Link
            href="/homestays"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full sm:w-auto gap-2 font-medium text-xs sm:text-sm shadow-sm",
            })}
          >
            <Building2 className="size-4" />
            Explore BuyHomestay Listings
            <ArrowRight className="size-3.5" />
          </Link>

          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto gap-2 font-medium text-xs sm:text-sm",
            })}
          >
            <HomeIcon className="size-4" />
            Host Dashboard
          </Link>
        </div>

        {/* Live System Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-xs text-muted-foreground mt-2">
          <div
            className={`h-2 w-2 rounded-full ${
              healthCheck.data ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span>
            API Network:{" "}
            <strong>
              {healthCheck.isLoading
                ? "Connecting..."
                : healthCheck.data
                  ? "Operational (oRPC Active)"
                  : "Standby"}
            </strong>
          </span>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {/* Card 1 */}
        <Card className="flex flex-col justify-between border transition-all hover:border-primary/40">
          <CardHeader className="space-y-1.5 pb-2">
            <div className="size-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle className="text-base font-semibold">
              Direct Host Deals
            </CardTitle>
            <CardDescription className="text-xs">
              Chat and transact directly with verified owners on WhatsApp. No surprise platform markups.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>Verified host profiles</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>Instant WhatsApp communication</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="flex flex-col justify-between border transition-all hover:border-primary/40">
          <CardHeader className="space-y-1.5 pb-2">
            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
              <Building2 className="size-5" />
            </div>
            <CardTitle className="text-base font-semibold">
              BuyHomestay Marketplace
            </CardTitle>
            <CardDescription className="text-xs">
              4 specialized investment categories: Property, Land, Airbnb Profiles, and Complete Businesses.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>Turnkey Airbnb portfolios</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>Strict category compliance</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="flex flex-col justify-between border transition-all hover:border-primary/40 sm:col-span-2 lg:col-span-1">
          <CardHeader className="space-y-1.5 pb-2">
            <div className="size-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1">
              <Bot className="size-5" />
            </div>
            <CardTitle className="text-base font-semibold">
              AI Chat Concierge
            </CardTitle>
            <CardDescription className="text-xs">
              24/7 intelligent assistance powered by OpenRouter & WAHA webhook automation.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>Instant reservation guidance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>AI-powered listing polish</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Quick WhatsApp Concierge Banner */}
      <section className="rounded-lg border bg-muted/20 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
            <MessageCircle className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Need Help Finding a Stay?</h3>
            <p className="text-xs text-muted-foreground">
              Our automated WhatsApp concierge webhook is ready to answer inquiries 24/7.
            </p>
          </div>
        </div>
        <Link
          href="/homestays"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "w-full sm:w-auto text-xs gap-1.5 shrink-0",
          })}
        >
          View All Listings
          <ArrowRight className="size-3" />
        </Link>
      </section>
    </div>
  );
}
