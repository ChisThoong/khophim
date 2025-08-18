import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "phimchill.site", // ảnh từ site WordPress
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // ảnh placeholder fallback
      },
      {
        protocol: "https",
        hostname: "img.ophim.live", // domain ảnh phim
      },
      {
        protocol: "https",
        hostname: "static.nutscdn.com", // nếu có ảnh ở CDN khác
      },
    ],
  },
};

export default nextConfig;
