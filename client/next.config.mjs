/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: { // <-- ESTE BLOCO É O PROBLEMA
    locales: ['en', 'pt', 'de', 'fr', 'ru'],
    defaultLocale: 'pt',
  },
};

export default nextConfig;