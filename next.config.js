/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/osteo-quiz',
  assetPrefix: '/osteo-quiz',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig