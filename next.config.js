/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  async redirects() {
    return [
      {
        source: "/categories/clothes",
        destination: "/categories/clothes/all",
        permanent: true,
      },
      {
        source: "/categories/accessory",
        destination: "/categories/accessory/all",
        permanent: true,
      },
      {
        source: "/categories/shoes",
        destination: "/categories/shoes/all",
        permanent: true,
      },
      {
        source: "/categories/bag",
        destination: "/categories/bag/all",
        permanent: true,
      },
      {
        source: "/categories/jewel",
        destination: "/categories/jewel/all",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
