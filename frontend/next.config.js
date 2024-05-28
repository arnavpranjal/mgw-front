/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "utfs.io",
      "localhost",
      "logobucketnestjs.s3.ap-south-1.amazonaws.com",
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};

module.exports = nextConfig;
// export default nextConfig;
