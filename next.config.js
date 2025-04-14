/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com'], // Добавьте домен вашего S3 бакета
  },
  // Для деплоя на Render
  output: 'standalone',
};

module.exports = nextConfig; 