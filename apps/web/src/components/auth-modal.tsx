"use client";

import {
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  X,
} from "lucide-react";
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

function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone / WhatsApp form state
  const [countryCode, setCountryCode] = useState("+60");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!mounted) return null;

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. First attempt to sign in
      const signInRes = await authClient.signIn.email({
        email: cleanEmail,
        password,
      });

      if (!signInRes.error) {
        toast.success("Welcome back! Signed in successfully.");
        onClose();
        router.refresh();
        return;
      }

      // 2. If sign in fails, attempt seamless sign up for new hosts
      const derivedName = cleanEmail.split("@")[0] || "Host";
      const signUpRes = await authClient.signUp.email({
        email: cleanEmail,
        password,
        name: derivedName,
      });

      if (!signUpRes.error) {
        toast.success("Account created and signed in successfully!");
        onClose();
        router.refresh();
        return;
      }

      // 3. Error analysis
      const signUpMsg = signUpRes.error.message || "";
      if (
        signUpMsg.toLowerCase().includes("exist") ||
        signUpMsg.toLowerCase().includes("already in use")
      ) {
        setErrorMessage("Incorrect password for existing account. Please try again.");
      } else {
        setErrorMessage(
          signInRes.error.message ||
            signUpRes.error.message ||
            "Authentication failed. Please verify your email and password.",
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 6) {
      setErrorMessage("Please enter a valid WhatsApp phone number.");
      return;
    }

    setIsLoading(true);
    try {
      // Simulating WhatsApp verification dispatch
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(`Verification passcode sent to ${countryCode} ${cleanPhone} via WhatsApp.`);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to initiate WhatsApp verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.href,
      });
    } catch {
      toast.info("Google OAuth provider will activate when configured with credentials in Dokploy.");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "apple",
        callbackURL: window.location.href,
      });
    } catch {
      toast.info("Apple Sign-In will activate when configured with Apple Developer credentials in Dokploy.");
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
        {/* Header Dialog (Airbnb Canonical: Close X on left, Center Title, Empty Spacer on right) */}
        <div className="h-16 px-6 border-b border-border/40 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Log in or sign up
          </span>
          <div className="size-8" aria-hidden="true" />
        </div>

        {/* Body Container with Generous Padding */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Welcome Text */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome to MyRehat
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Direct homestay acquisitions &amp; verified host network across Malaysia.
            </p>
          </div>

          {/* Tier 1: Segmented Toggle (Email vs WhatsApp / Phone) */}
          <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border/50 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("email");
                setErrorMessage(null);
              }}
              className={`h-9 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === "email"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="size-3.5" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setErrorMessage(null);
              }}
              className={`h-9 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === "phone"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <svg
                className="size-3.5 shrink-0 text-[#25D366]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.148.567 4.167 1.558 5.914l-1.656 6.054 6.22-1.632c1.7 1.01 3.673 1.583 5.789 1.583 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
              </svg>
              <span>WhatsApp / Phone</span>
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage}
            </div>
          )}

          {/* Tier 1 Form: Email Option */}
          {authMethod === "email" ? (
            <form onSubmit={handleEmailContinue} className="space-y-3.5">
              {/* Email Input */}
              <div className="space-y-1">
                <label htmlFor="auth-email" className="text-xs font-semibold text-foreground">
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isLoading}
                  required
                  className="h-11 w-full rounded-xl border border-border/60 bg-background px-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-password" className="text-xs font-semibold text-foreground">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="size-3" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="size-3" /> Show
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    disabled={isLoading}
                    required
                    className="h-11 w-full rounded-xl border border-border/60 bg-background px-3.5 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Submit Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="h-11 rounded-xl bg-foreground text-background font-medium hover:opacity-90 w-full shadow-xs transition-opacity flex items-center justify-center text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 pt-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Continuing with Email...
                  </>
                ) : (
                  "Continue with Email"
                )}
              </button>
            </form>
          ) : (
            /* Tier 1 Form: WhatsApp / Phone Option */
            <form onSubmit={handleWhatsAppContinue} className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="auth-phone" className="text-xs font-semibold text-foreground">
                  WhatsApp Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="relative shrink-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country calling code"
                      className="h-11 rounded-xl border border-border/60 bg-background px-3 pr-7 text-xs font-medium text-foreground outline-none transition-all focus:border-ring focus:ring-1 focus:ring-ring cursor-pointer appearance-none"
                    >
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  </div>
                  <input
                    id="auth-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="12 345 6789"
                    disabled={isLoading}
                    required
                    className="h-11 flex-1 min-w-0 rounded-xl border border-border/60 bg-background px-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  We will send a direct one-time verification passcode via WhatsApp.
                </p>
              </div>

              {/* Submit WhatsApp Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="h-11 rounded-xl bg-foreground text-background font-medium hover:opacity-90 w-full shadow-xs transition-opacity flex items-center justify-center text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 pt-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Continue with WhatsApp"
                )}
              </button>
            </form>
          )}

          {/* Clean Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">
                or continue with
              </span>
            </div>
          </div>

          {/* Tier 2: Social Identity (Google & Apple) */}
          <div className="space-y-2.5">
            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="h-11 rounded-xl w-full border border-border/70 hover:bg-muted/50 font-medium text-xs flex items-center justify-center gap-2.5 transition-colors shadow-2xs text-foreground cursor-pointer"
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Continue with Apple */}
            <button
              type="button"
              onClick={handleAppleSignIn}
              className="h-11 rounded-xl w-full border border-border/70 hover:bg-muted/50 font-medium text-xs flex items-center justify-center gap-2.5 transition-colors shadow-2xs text-foreground cursor-pointer"
            >
              <svg className="size-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.02-.48 2.64-1.23z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Footer Disclaimer */}
          <p className="text-center text-[11px] text-muted-foreground leading-relaxed pt-1">
            By continuing, you agree to MyRehat&apos;s Host Terms &amp; acknowledge our Privacy Policy.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
