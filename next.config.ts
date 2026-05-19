import type { NextConfig } from "next";

const isTauri = process.env.TAURI_BUILD === "1";
const isProd = process.env.NODE_ENV === "production";
const internalHost = process.env.TAURI_DEV_HOST || "localhost";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isTauri
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
  turbopack: {},
  assetPrefix:
    isTauri && !isProd ? `http://${internalHost}:3000` : undefined,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
