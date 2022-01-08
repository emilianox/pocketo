/** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
//   images: {
//     domains: ['picsum.photos'],
//   },
// }

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  // reactStrictMode: true,
  images: {
    domains: ["picsum.photos"],
    formats: ['image/avif', 'image/webp']
  },
  swcMinify: true,
});
