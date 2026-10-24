"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@myrehat-task-b/ui/components/dropdown-menu";
import { Skeleton } from "@myrehat-task-b/ui/components/skeleton";
import { Building2, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { useAuthModal } from "./auth-modal";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { openAuthModal } = useAuthModal();

  if (isPending) {
    return <Skeleton className="h-9 w-24 rounded-full" />;
  }

  if (!session) {
    return (
      <button
        type="button"
        onClick={openAuthModal}
        className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
      >
        Sign In
      </button>
    );
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-full border border-border/50 bg-background/60 px-3 py-1 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold text-foreground">
          {initials}
        </span>
        <span className="max-w-[100px] truncate text-foreground font-medium sm:max-w-[140px] text-xs">
          {session.user.name}
        </span>
        <ChevronDown className="size-3 text-muted-foreground opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-56 rounded-xl border border-border/60 bg-popover/95 p-1.5 shadow-xl backdrop-blur-md"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-2">
            <p className="text-xs font-semibold text-foreground leading-tight">{session.user.name}</p>
            <p className="truncate text-[11px] text-muted-foreground font-normal mt-0.5">{session.user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            className="rounded-lg px-2.5 py-2 text-xs cursor-pointer hover:bg-accent/60"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="mr-2 size-3.5 text-muted-foreground" />
            <span>Host Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-lg px-2.5 py-2 text-xs cursor-pointer hover:bg-accent/60"
            onClick={() => router.push("/homestays")}
          >
            <Building2 className="mr-2 size-3.5 text-muted-foreground" />
            <span>Marketplace Listings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            variant="destructive"
            className="rounded-lg px-2.5 py-2 text-xs cursor-pointer"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/";
                  },
                },
              });
            }}
          >
            <LogOut className="mr-2 size-3.5 text-destructive" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
