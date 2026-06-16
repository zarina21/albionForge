import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/build",
        destination: "/builds",
        permanent: true,
      },
      {
        source: "/recoleccion",
        destination: "/resources",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
