"use client";

import { Button, buttonVariants } from "@myrehat-task-b/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@myrehat-task-b/ui/components/card";
import { Input } from "@myrehat-task-b/ui/components/input";
import { Label } from "@myrehat-task-b/ui/components/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, DollarSign, Loader2, MapPin, Phone, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

const CATEGORIES = [
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

type Category = (typeof CATEGORIES)[number];

interface HomestayFormProps {
  onSuccess?: () => void;
}

export default function HomestayForm({ onSuccess }: HomestayFormProps) {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<Category>("Buy Property");
  const [contactWa, setContactWa] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = useMutation({
    ...orpc.homestays.create.mutationOptions(),
    onSuccess: () => {
      toast.success("Listing created successfully!");
      setTitle("");
      setPrice("");
      setLocation("");
      setCategory("Buy Property");
      setContactWa("");
      setFormError(null);
      // Invalidate homestays list query
      queryClient.invalidateQueries({
        queryKey: orpc.homestays.list.queryKey(),
      });
      onSuccess?.();
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to create listing";
      setFormError(message);
      toast.error(message);
    },
  });

  if (isSessionLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card className="w-full border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Authentication Required</CardTitle>
          <CardDescription>
            You must be signed in to submit a BuyHomestay listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Sign In to Create Listing
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client-side pre-validation
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }
    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setFormError("Please enter a valid positive price");
      return;
    }
    if (!location.trim()) {
      setFormError("Location is required");
      return;
    }
    if (!CATEGORIES.includes(category)) {
      setFormError("Invalid category selected");
      return;
    }
    if (!contactWa.trim()) {
      setFormError("WhatsApp contact is required");
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="size-5 text-primary" />
          Create BuyHomestay Listing
        </CardTitle>
        <CardDescription>
          Fill in the details below to list a new homestay property or business opportunity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
              {formError}
            </div>
          )}

          {/* 1. Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-medium">
              Listing Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. Modern Villa in Cameron Highlands"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={createMutation.isPending}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 2. Price */}
            <div className="space-y-1.5">
              <Label htmlFor="price" className="flex items-center gap-1 text-xs font-medium">
                <DollarSign className="size-3.5 text-muted-foreground" />
                Price (MYR / IDR) *
              </Label>
              <Input
                id="price"
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 350000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={createMutation.isPending}
                required
              />
            </div>

            {/* 3. Location */}
            <div className="space-y-1.5">
              <Label htmlFor="location" className="flex items-center gap-1 text-xs font-medium">
                <MapPin className="size-3.5 text-muted-foreground" />
                Location *
              </Label>
              <Input
                id="location"
                placeholder="e.g. Cameron Highlands, Pahang"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={createMutation.isPending}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 4. Category (Dropdown with EXACT 4 options) */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="flex items-center gap-1 text-xs font-medium">
                <Tag className="size-3.5 text-muted-foreground" />
                Category *
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                disabled={createMutation.isPending}
                className="h-8 w-full rounded-none border border-input bg-background px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Contact WhatsApp */}
            <div className="space-y-1.5">
              <Label htmlFor="contactWa" className="flex items-center gap-1 text-xs font-medium">
                <Phone className="size-3.5 text-muted-foreground" />
                WhatsApp Contact *
              </Label>
              <Input
                id="contactWa"
                placeholder="e.g. +60123456789 or 628123456789"
                value={contactWa}
                onChange={(e) => setContactWa(e.target.value)}
                disabled={createMutation.isPending}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full sm:w-auto"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Publishing Listing...
                </>
              ) : (
                "Publish Listing"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

