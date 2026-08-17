import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: process.env.NEXT_BASE_PATH ? `${process.env.NEXT_BASE_PATH}/` : undefined,
};

export default nextConfig;
