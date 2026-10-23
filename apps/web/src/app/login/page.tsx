"use client";

import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone/WhatsApp form state
  const [countryCode, setCountryCode] = useState("+60");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        router.push("/dashboard");
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
        router.push("/dashboard");
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
        callbackURL: "/dashboard",
      });
    } catch {
      toast.info("Google OAuth provider will activate when configured with credentials in Dokploy.");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "apple",
        callbackURL: "/dashboard",
      });
    } catch {
      toast.info("Apple Sign-In will activate when configured with Apple Developer credentials in Dokploy.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 bg-muted/30 relative overflow-hidden">
      {/* Subtle Dot Grid and Soft Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Main Container with Depth */}
      <div className="relative z-10 max-w-[460px] w-full space-y-3">
        {/* Back navigation link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to marketplace
        </Link>

        {/* Solid Card with Modern Studio Depth */}
        <div className="w-full rounded-3xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl shadow-zinc-950/5 p-6 sm:p-8 space-y-6">
          {/* Header Dialog (Centered Title) */}
          <div className="text-center pb-4 border-b border-border/40">
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
              <div className="space-y-1">
                <label htmlFor="login-email" className="text-xs font-semibold text-foreground">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isLoading}
                  required
                  className="h-11 w-full rounded-xl border border-border/60 bg-background px-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs font-semibold text-foreground">
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
                    id="login-password"
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
                <label htmlFor="login-phone" className="text-xs font-semibold text-foreground">
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
                    id="login-phone"
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
    </div>
  );
}
