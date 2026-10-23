import { createAuthClient } from "better-auth/react";

function getServerUrl() {
  if (typeof window !== "undefined") {
    // In browser, use window.location.origin so Better-Auth receives a valid absolute URL,
    // and Next.js rewrites in next.config.ts automatically proxy /api/auth to backend
    return window.location.origin;
  }

  const processEnv = typeof process === "undefined" ? undefined : process.env;
  if (processEnv?.SERVER_URL) {
    return processEnv.SERVER_URL.endsWith("/")
      ? processEnv.SERVER_URL.slice(0, -1)
      : processEnv.SERVER_URL;
  }

  const target = processEnv?.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  return target.endsWith("/") ? target.slice(0, -1) : target;
}

export const authClient = createAuthClient({
  baseURL: `${getServerUrl()}/api/auth`,
});
