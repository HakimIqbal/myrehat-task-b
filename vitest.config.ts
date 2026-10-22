import path from "node:path";
import { defineConfig } from "vitest/config";

const rootDir = import.meta.dirname;

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts", "tests/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
  },
  resolve: {
    alias: {
      "next/server": path.resolve(rootDir, "./apps/web/node_modules/next/server.js"),
      "next": path.resolve(rootDir, "./apps/web/node_modules/next"),
      "@openrouter/ai-sdk-provider": path.resolve(
        rootDir,
        "./apps/web/node_modules/@openrouter/ai-sdk-provider",
      ),
      "@": path.resolve(rootDir, "./apps/web/src"),
      "@myrehat-task-b/api": path.resolve(rootDir, "./packages/api/src"),
      "@myrehat-task-b/db": path.resolve(rootDir, "./packages/db/src"),
      "@myrehat-task-b/auth": path.resolve(rootDir, "./packages/auth/src"),
      "@myrehat-task-b/ui": path.resolve(rootDir, "./packages/ui/src"),
    },
  },
});

