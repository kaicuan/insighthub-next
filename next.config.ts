import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    remotePatterns: [
      {
        protocol: "https",
         hostname: "*.googleusercontent.com",
         port: "",
         pathname: "**",
      },
    ],
  },
};

export default nextConfig;
