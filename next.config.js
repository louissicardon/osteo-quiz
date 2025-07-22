/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Appliquer basePath seulement en production
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/osteo-quiz',
    assetPrefix: '/osteo-quiz'
  })
}

module.exports = nextConfig