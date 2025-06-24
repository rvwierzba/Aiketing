/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'pt', 'de', 'fr', 'ru'],
    defaultLocale: 'pt',
  },
};

export default nextConfig;