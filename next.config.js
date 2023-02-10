/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
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
        source: "/products/categories",
        destination: "/products/categories/all?orderby=popularity",
        permanent: true,
      },
      {
        source: "/profile",
        destination: "/account?tab=profile",
        permanent: true,
      },
      ...[
        "/products/categories/clothes",
        "/products/categories/accessory",
        "/products/categories/shoes",
        "/products/categories/bag",
        "/products/categories/jewel",
      ].map((source) => ({
        source,
        destination: `${source}/all?orderby=popularity`,
        permanent: true,
      })),
    ];
  },
};

module.exports = nextConfig;
