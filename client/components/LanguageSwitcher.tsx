// components/LanguageSwitcher.tsx
import { useChangeLocale, useCurrentLocale } from '../lib/i18n';
import Image from 'next/image';

export const LanguageSwitcher = () => {
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const locales = [
    { code: 'pt', name: 'Português', flag: '/flags/br.svg' },
    { code: 'en', name: 'English', flag: '/flags/us.svg' },
    { code: 'de', name: 'Deutsch', flag: '/flags/de.svg' },
    { code: 'fr', name: 'Français', flag: '/flags/fr.svg' },
    { code: 'ru', name: 'Русский', flag: '/flags/ru.svg' },
  ];

  return (
    <div className="flex items-center gap-2">
      {locales.map(locale => (
        <button
          key={locale.code}
          onClick={() => changeLocale(locale.code)}
          className={`p-1 rounded-sm transition-opacity ${
            currentLocale === locale.code
              ? 'opacity-100 ring-2 ring-brand-blue' // Destaque para o idioma ativo
              : 'opacity-60 hover:opacity-100'
          }`}
          aria-label={`Mudar idioma para ${locale.name}`}
        >
          <Image
            src={locale.flag}
            alt={locale.name}
            width={24}
            height={18}
            className="w-6 h-auto"
          />
        </button>
      ))}
    </div>
  );
};