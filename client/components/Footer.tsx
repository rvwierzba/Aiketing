// components/Footer.tsx
import { useScopedI18n } from '../lib/i18n';

export const Footer = () => {
  const t = useScopedI18n('Footer');
  
  // CORREÇÃO: Fazemos a substituição da variável manualmente
  const copyrightText = t('Copyright').replace('{year}', new Date().getFullYear().toString());

  return (
    <footer className="bg-gray-800">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400">
          {copyrightText}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {t('CreatedBy')} <a href="https://www.rvwtech.com.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">RVWtech</a>
        </p>
      </div>
    </footer>
  );
};