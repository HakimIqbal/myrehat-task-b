"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

function isEmailAddress(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function isPhoneNumber(val: string): boolean {
  const digits = val.replace(/[^0-9]/g, "");
  return digits.length >= 8;
}

export default function LoginPage() {
  const router = useRouter();

  // Step 1: "identifier" (Phone number or email) -> Step 2: "password" (if email) OR "otp" (if phone)
  const [step, setStep] = useState<"identifier" | "password" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const trimmed = identifier.trim();
    if (!trimmed) {
      setErrorMessage("Please enter your phone number or email address.");
      return;
    }

    if (isEmailAddress(trimmed)) {
      setStep("password");
    } else if (isPhoneNumber(trimmed)) {
      setStep("otp");
      toast.success(
        `Verification code would be sent to ${trimmed} via WhatsApp. Enter your 6-digit code or continue with password.`,
      );
    } else {
      setErrorMessage("Please enter a valid email address or phone number.");
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
      const signInRes = await authClient.signIn.email({
        email,
        password,
      });

      if (signInRes?.error) {
        const signUpRes = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0] || "Host",
        });

        if (signUpRes?.error) {
          setErrorMessage(
            signInRes.error.message ||
              signUpRes.error.message ||
              "Invalid credentials. Please verify your password.",
          );
          setIsLoading(false);
          return;
        }

        toast.success("Welcome to MyRehat! Account created successfully.");
      } else {
        toast.success("Signed in successfully. Welcome back!");
      }

      router.push("/homestays");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage("Please enter the verification code sent to your WhatsApp.");
      return;
    }
    toast.success("WhatsApp verification verified! (Demo Sandbox Mode)");
    router.push("/homestays");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: typeof window !== "undefined" ? window.location.origin + "/homestays" : "/homestays",
      });
    } catch {
      toast.info("Google OAuth provider requires client ID credentials on server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "apple",
        callbackURL: typeof window !== "undefined" ? window.location.origin + "/homestays" : "/homestays",
      });
    } catch {
      toast.info("Apple Sign-In provider requires Apple Developer credentials on server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-muted/30 p-4 sm:p-6">
      {/* Ambient Backdrop: Soft Dot Grid + Subtle Radial Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

      {/* Back to Marketplace Link */}
      <div className="relative z-10 mb-4 w-full max-w-[500px]">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Back to marketplace
        </Link>
      </div>

      {/* Dedicated Card Container (Airbnb-Canonical) */}
      <div className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-3xl border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="space-y-6">
          {/* Header Title */}
          <div className="border-b border-border/40 pb-4 text-center">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Log in or sign up
            </span>
          </div>

          {/* Welcome Text */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome to MyRehat
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Direct homestay marketplace and host network across Malaysia.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Phone number or email (Airbnb Unified Input) */}
          {step === "identifier" && (
            <form onSubmit={handleIdentifierSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="page-identifier"
                  className="text-xs font-semibold text-foreground"
                >
                  Phone number or email
                </label>
                <input
                  id="page-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or +60 12 345 6789"
                  disabled={isLoading}
                  autoFocus
                  required
                  className="h-12 w-full rounded-xl border border-border/70 bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring shadow-2xs"
                />
                <p className="text-[11px] text-muted-foreground/80">
                  We&apos;ll confirm your email or WhatsApp number. Standard rates apply.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !identifier.trim()}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-foreground font-semibold text-background text-sm shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
              </button>
            </form>
          )}

          {/* STEP 2A: Password Input (If Email detected) */}
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate max-w-[280px] font-medium text-foreground">
                  {identifier}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("identifier");
                    setPassword("");
                    setErrorMessage(null);
                  }}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="page-password"
                    className="text-xs font-semibold text-foreground"
                  >
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
                <input
                  id="page-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoFocus
                  required
                  className="h-12 w-full rounded-xl border border-border/70 bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-foreground font-semibold text-background text-sm shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Log in / Sign up"}
              </button>
            </form>
          )}

          {/* STEP 2B: OTP Input (If Phone number detected) */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate max-w-[280px] font-medium text-foreground">
                  {identifier}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("identifier");
                    setOtpCode("");
                    setErrorMessage(null);
                  }}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="page-otp" className="text-xs font-semibold text-foreground">
                  Enter 6-digit WhatsApp code
                </label>
                <input
                  id="page-otp"
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  disabled={isLoading}
                  autoFocus
                  required
                  className="h-12 w-full text-center tracking-widest text-lg font-mono rounded-xl border border-border/70 bg-background px-4 outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length < 4}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-foreground font-semibold text-background text-sm shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Verify & Continue"}
              </button>
            </form>
          )}

          {/* Divider: Clean Airbnb "or" */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground font-medium">or</span>
            </div>
          </div>

          {/* Social Identity Buttons (Airbnb Standard: Google + Apple) */}
          <div className="space-y-2.5">
            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-border/70 font-medium text-foreground text-xs shadow-2xs transition-colors hover:bg-muted/50"
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-border/70 font-medium text-foreground text-xs shadow-2xs transition-colors hover:bg-muted/50"
            >
              <svg
                className="size-4 shrink-0 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
    </div>
  );
}
