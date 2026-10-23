import type { AppRouterClient } from "@myrehat-task-b/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        toast.error(`Error: ${error.message}`, {
          action: {
            label: "retry",
            onClick: () => {
              query.invalidate();
            },
          },
        });
      },
    }),
  });
}

export const queryClient = createQueryClient();

function getServerUrl() {
  if (typeof window !== "undefined") {
    // In browser, use window.location.origin so client sends requests to the Next.js app host,
    // and Next.js rewrites in next.config.ts automatically proxy /rpc to the backend
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

export const link = new RPCLink({
  url: `${getServerUrl()}/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
  headers: async () => {
    if (typeof window !== "undefined") {
      return {};
    }

    const { headers } = await import("next/headers");
    return Object.fromEntries(await headers());
  },
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
