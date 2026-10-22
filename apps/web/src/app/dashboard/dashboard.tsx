"use client";

import { Button, buttonVariants } from "@myrehat-task-b/ui/components/button";
import {
  Card,
  CardContent,
} from "@myrehat-task-b/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { Building2, Plus, ShieldCheck, UserCheck } from "lucide-react";
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

  return (
    <div className="space-y-8">
      {/* User Welcome Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <UserCheck className="size-3.5" />
            Authenticated User
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {session.user.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {session.user.email} &bull; User ID: {session.user.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant={showCreateForm ? "outline" : "default"}
            className="text-xs"
          >
            <Plus className="mr-1.5 size-3.5" />
            {showCreateForm ? "Close Form" : "Create Listing"}
          </Button>
          <Link
            href="/homestays"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "text-xs",
            })}
          >
            <Building2 className="mr-1.5 size-3.5" />
            Public Marketplace
          </Link>
        </div>
      </div>

      {/* Auth verification badge */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="flex items-center justify-between py-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>
              Protected Procedure status:{" "}
              <strong>{privateData.data?.message || "Validating..."}</strong>
            </span>
          </div>
          <span className="text-muted-foreground">Session Active</span>
        </CardContent>
      </Card>

      {/* Collapsible Listing Form */}
      {showCreateForm && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Post a BuyHomestay Listing</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
              className="text-xs text-muted-foreground"
            >
              Hide Form
            </Button>
          </div>
          <HomestayForm onSuccess={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Homestay Listings Management */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Active BuyHomestay Listings
          </h2>
          <p className="text-xs text-muted-foreground">
            Browse all property, land, and Airbnb profile listings submitted to the marketplace.
          </p>
        </div>
        <HomestayList />
      </div>
    </div>
  );
}
