/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Assurer que les routes dynamiques ne sont pas pré-rendues
  experimental: {
    dynamicIO: true,
  },
}

export default nextConfig
