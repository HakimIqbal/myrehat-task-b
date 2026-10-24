"use client";

import { Eye, EyeOff, Loader2, Mail, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface AuthModalContextType {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthModalContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
      {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
    </AuthModalContext.Provider>
  );
}

function isEmailAddress(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function isPhoneOrWhatsApp(val: string): boolean {
  // Detect phone: string that is mostly digits (with optional +, spaces, dashes)
  const stripped = val.replace(/[\s\-().+]/g, "");
  return /^\d{7,}$/.test(stripped);
}

export function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  // Step 1: "identifier" (email only) -> Step 2: "password"
  const [step, setStep] = useState<"identifier" | "password">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Esc key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const trimmed = identifier.trim();
    if (!trimmed) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    // Reject phone/WhatsApp numbers with a contextual message
    if (isPhoneOrWhatsApp(trimmed) && !isEmailAddress(trimmed)) {
      setErrorMessage(
        "WhatsApp direct messaging is reserved for Concierge inquiries. Please enter your email to access Host features.",
      );
      return;
    }

    if (isEmailAddress(trimmed)) {
      setStep("password");
    } else {
      setErrorMessage("Please enter a valid email address (e.g. name@example.com).");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const email = identifier.trim().toLowerCase();

      // Step a: Try sign-in first
      const signInRes = await authClient.signIn.email({ email, password });

      if (signInRes?.error) {
        // Step b: Auto sign-up if user not found
        const signUpRes = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0] || "Host",
        });

        if (signUpRes?.error) {
          // Step c: Both failed → email exists but password is wrong
          setErrorMessage(
            "Incorrect password for this host account. Please try again.",
          );
          setIsLoading(false);
          return;
        }

        toast.success("Welcome to MyRehat! Your host account has been created.");
      } else {
        toast.success("Signed in successfully. Welcome back!");
      }

      onClose();
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = (provider: "Google" | "Apple") => {
    toast.info(
      `${provider} single sign-on will be enabled in the upcoming production release. Please continue with your Host email.`,
    );
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Log in or sign up"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Floating Container — max-w-[460px] for mobile safety */}
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-border/40 bg-background shadow-[0_8px_28px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-200">

        {/* Header: X on left — centered title — spacer on right */}
        <div className="flex h-14 items-center justify-between border-b border-border/30 px-5">
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Log in or sign up
          </span>
          <div className="size-8" aria-hidden="true" />
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">

          {/* Welcome Typography */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome to MyRehat
            </h2>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Email-only identifier */}
          {step === "identifier" && (
            <form onSubmit={handleIdentifierSubmit} className="space-y-4">
              <div className="rounded-xl border border-border/80 bg-background transition-all focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground">
                <label
                  htmlFor="auth-identifier"
                  className="block px-3.5 pt-2.5 text-xs font-medium text-foreground"
                >
                  Email address
                </label>
                <input
                  id="auth-identifier"
                  type="text"
                  inputMode="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isLoading}
                  autoFocus
                  required
                  className="h-7 w-full bg-transparent px-3.5 pb-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !identifier.trim()}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white font-semibold text-sm tracking-wide shadow-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
              </button>
            </form>
          )}

          {/* STEP 2: Password + auto sign-up */}
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Active email badge pill + Change link */}
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-3.5 py-2.5 shadow-2xs">
                <div className="flex min-w-0 items-center gap-2">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate max-w-[240px] sm:max-w-[280px] text-xs sm:text-sm font-semibold text-foreground">
                    {identifier}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("identifier");
                    setPassword("");
                    setErrorMessage(null);
                  }}
                  className="shrink-0 text-xs font-semibold text-[#E61E4D] hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Password input with Show/Hide toggle */}
              <div className="rounded-xl border border-border/80 bg-background transition-all focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground">
                <div className="flex items-center justify-between px-3.5 pt-2.5">
                  <label
                    htmlFor="auth-password"
                    className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <><EyeOff className="size-3" /> Hide</>
                    ) : (
                      <><Eye className="size-3" /> Show</>
                    )}
                  </button>
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoFocus
                  required
                  className="h-7 w-full bg-transparent px-3.5 pb-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white font-semibold text-sm tracking-wide shadow-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Continue to Host Account"}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-xs font-semibold text-muted-foreground/80">or</span>
            </div>
          </div>

          {/* Social Buttons — disabled "Coming soon" state */}
          <div className="space-y-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialClick("Google")}
              className="relative flex h-12 w-full items-center rounded-xl border border-border/50 bg-muted/20 px-4 text-sm font-medium text-foreground opacity-60 cursor-not-allowed"
              tabIndex={-1}
              aria-disabled="true"
            >
              <svg className="absolute left-4 size-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="w-full text-center">Continue with Google</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleSocialClick("Apple")}
              className="relative flex h-12 w-full items-center rounded-xl border border-border/50 bg-muted/20 px-4 text-sm font-medium text-foreground opacity-60 cursor-not-allowed"
              tabIndex={-1}
              aria-disabled="true"
            >
              <svg className="absolute left-4 size-[18px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.02-.48 2.64-1.23z" />
              </svg>
              <span className="w-full text-center">Continue with Apple</span>
            </button>
          </div>

          {/* Footer Disclaimer */}
          <p className="text-center text-xs text-muted-foreground/80 leading-relaxed pt-1">
            By continuing, you agree to our{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("MyRehat Terms of Service adheres to Malaysian hospitality standards.");
              }}
              className="underline hover:text-foreground transition-colors cursor-pointer"
            >
              Terms of Service
            </a>{" "}
            and acknowledge our{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("MyRehat adheres strictly to Malaysian Personal Data Protection Act (PDPA).");
              }}
              className="underline hover:text-foreground transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
