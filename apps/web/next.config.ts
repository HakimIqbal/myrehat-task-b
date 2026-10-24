import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const withVarlock = varlockNextConfigPlugin();
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  output: "standalone",
  transpilePackages: ["shiki"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const serverUrl =
      process.env.SERVER_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "http://localhost:3000";
    return [
      {
        source: "/rpc/:path*",
        destination: `${serverUrl}/rpc/:path*`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${serverUrl}/api/auth/:path*`,
      },
      {
        source: "/api/ai",
        destination: `${serverUrl}/api/ai`,
      },
      {
        source: "/ai",
        destination: `${serverUrl}/ai`,
      },
    ];
  },
};

export default withVarlock(nextConfig);
