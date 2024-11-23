import { remarkCodeHike } from "@code-hike/mdx";
import nextMDX from "@next/mdx";

// const MillionLint = require("@million/lint");
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkCodeHike, { theme: "nord" }]],
  },
});

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// module.exports = withMDX(nextConfig);

// module.exports = MillionLint.next({
//   enabled: true,
//   rsc: true
// })(withBundleAnalyzer(nextConfig));

export default withMDX(nextConfig);
