/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Este bloco informa ao Next.js sobre seus idiomas
  // e é o método correto para a sua estrutura de projeto.
  i18n: {
    locales: ['en', 'pt', 'de', 'fr', 'ru'],
    defaultLocale: 'pt',
  },
};

export default nextConfig;