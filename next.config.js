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
  redirects: {
    source: "/new-editor/:path",
    destination: "/new-editor/:path/media",
    permanent: true,
  },
};

module.exports = nextConfig;
