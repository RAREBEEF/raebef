/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/cancelPayment/:paymentkey",
        destination: `https://api.tosspayments.com/v1/payments/:paymentkey/cancel`,
      },
      {
        source: "/api/confirmPayment",
        destination: `https://api.tosspayments.com/v1/payments/confirm`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/profile",
        destination: "/account?tab=profile",
        permanent: true,
      },
      ...[
        "/categories/clothes",
        "/categories/accessory",
        "/categories/shoes",
        "/categories/bag",
        "/categories/jewel",
      ].map((source) => ({
        source,
        destination: `${source}/all?orderby=popularity`,
        permanent: true,
      })),
    ];
  },
};

module.exports = nextConfig;
