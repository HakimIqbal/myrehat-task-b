"use client";

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
import {
  AlertCircle,
  Briefcase,
  Building,
  DollarSign,
  LandPlot,
  Loader2,
  MapPin,
  MessageSquare,
  Percent,
  Phone,
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

import { useAuthModal } from "../auth-modal";

export const CATEGORIES = [
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

export type Category = (typeof CATEGORIES)[number];

const CATEGORY_DETAILS: Record<Category, { description: string; icon: any }> = {
  "Buy Property": {
    description: "Turnkey furnished homestay villa or residential property ready for guest check-ins.",
    icon: Building,
  },
  "Buy land to build homestay": {
    description: "Strategic land parcel with permits for custom eco-stay, glamping, or villa development.",
    icon: LandPlot,
  },
  "Buy Airbnb Profile": {
    description: "Established Superhost account with stellar 5-star ratings, guest history, and high search rank.",
    icon: User,
  },
  "Buy Airbnb Business": {
    description: "Complete operational homestay company with ongoing master leases, operating staff, and cash flow.",
    icon: Briefcase,
  },
};

interface HomestayFormProps {
  onSuccess?: () => void;
}

export default function HomestayForm({ onSuccess }: HomestayFormProps) {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const { openAuthModal } = useAuthModal();
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
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to create listing. Please check your inputs.";
      setFormError(message);
      toast.error(message);
    },
  });

  if (isSessionLoading) {
    return (
      <Card className="w-full border-border/50 shadow-xs max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-foreground" />
          <p className="mt-2 text-xs text-muted-foreground">Verifying host session...</p>
        </CardContent>
      </Card>
    );
  }

  // 4. Split-Card Host Onboarding for Unauthenticated Guests
  if (!session?.user) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10 rounded-2xl border border-border/60 bg-gradient-to-br from-background via-muted/10 to-muted/30 shadow-xs">
        {/* Kolom Kiri: Host Benefits Showcase */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Host Partnership Program
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
              Why List on MyRehat Marketplace?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Connect with serious buyers and hospitality entrepreneurs seeking verified stays, land, and operational businesses.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Benefit 1 */}
            <div className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background text-foreground shadow-2xs">
                <MessageSquare className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                  Direct Buyer Connections
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Langsung tersambung ke WhatsApp calon pembeli tanpa perantara agen.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background text-foreground shadow-2xs">
                <Percent className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                  Zero Hidden Commissions
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  100% hasil transaksi milik Anda, MyRehat mengenakan 0% biaya potongan listing.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background text-foreground shadow-2xs">
                <ShieldCheck className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                  Verified Hospitality Network
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Paparan langsung ke investor properti dan pengusaha Airbnb di seluruh Malaysia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Quick Sign-In Action Card */}
        <div className="flex flex-col justify-center rounded-xl border border-border/60 bg-background/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Ready to list your property?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Sign in with your host account to publish and manage your listings in under 2 minutes.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 shadow-sm cursor-pointer"
            >
              Sign In to Continue
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Free to list &middot; Instant WhatsApp activation &middot; Direct host control
            </p>
          </div>
        </div>
      </div>
    );
  }

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

  const SelectedCategoryIcon = CATEGORY_DETAILS[category].icon;

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-2xl border border-border/60 bg-card shadow-xs">
      <CardHeader className="border-b border-border/40 pb-5">
        <CardTitle className="text-lg font-bold tracking-tight text-foreground">
          Post a BuyHomestay Listing
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          Submit your vacation home, development plot, or Airbnb business to verified buyers.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-semibold text-foreground">
              Listing Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. 4-Bedroom Scandinavian Villa with Infinity Pool"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={createMutation.isPending}
              className="h-11 rounded-xl text-sm"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              A concise, descriptive title highlighting property type, capacity, or location appeal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* 2. Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <DollarSign className="size-3.5 text-muted-foreground" />
                Price (MYR) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  RM
                </span>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  step="any"
                  placeholder="350000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={createMutation.isPending}
                  className="h-11 rounded-xl pl-11 text-sm"
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Total asking investment price or asset transfer value.
              </p>
            </div>

            {/* 3. Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <MapPin className="size-3.5 text-muted-foreground" />
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g. Cameron Highlands, Pahang"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={createMutation.isPending}
                className="h-11 rounded-xl text-sm"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                City, state, or key tourism destination.
              </p>
            </div>
          </div>

          {/* 4. Category Selector with Explicit 4 Options */}
          <div className="space-y-2.5">
            <Label htmlFor="category" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Tag className="size-3.5 text-muted-foreground" />
              Listing Category <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                disabled={createMutation.isPending}
                className="h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 text-xs font-medium text-foreground outline-none transition-all focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-8"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ▾
              </span>
            </div>

            {/* Subtle category explainer */}
            <div className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs">
              <SelectedCategoryIcon className="size-4 shrink-0 text-muted-foreground mt-0.5" />
              <div className="text-[11px] leading-relaxed text-muted-foreground">
                <strong className="text-foreground">{category}: </strong>
                {CATEGORY_DETAILS[category].description}
              </div>
            </div>
          </div>

          {/* 5. WhatsApp Contact */}
          <div className="space-y-2">
            <Label htmlFor="contactWa" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Phone className="size-3.5 text-muted-foreground" />
              WhatsApp Contact Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactWa"
              placeholder="+60123456789 or 60123456789"
              value={contactWa}
              onChange={(e) => setContactWa(e.target.value)}
              disabled={createMutation.isPending}
              className="h-11 rounded-xl text-sm"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Interested buyers will contact you directly via WhatsApp. Include country code.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-opacity hover:opacity-90 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
      </CardContent>
    </Card>
  );
}
