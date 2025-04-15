/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'i.ytimg.com', 'img.youtube.com'], // Домены для YouTube превью
  },
  // Для деплоя на Render
  output: 'standalone',
};

module.exports = nextConfig; 