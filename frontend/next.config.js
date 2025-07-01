/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 在生产构建时进行类型检查
    ignoreBuildErrors: false,
  },
  eslint: {
    // 在生产构建时进行 ESLint 检查
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
