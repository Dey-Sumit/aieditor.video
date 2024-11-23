const MillionLint = require("@million/lint");
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
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = nextConfig;
// module.exports = MillionLint.next({
//   enabled: true,
//   rsc: true
// })(withBundleAnalyzer(nextConfig));
