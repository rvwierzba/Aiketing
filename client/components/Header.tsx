// components/Header.tsx
import { useI18n } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import Link from 'next/link';
import Image from 'next/image'; // 1. Importamos o componente de Imagem do Next.js

export const Header = () => {
  const t = useI18n();
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 bg-white">
      {/* 2. Substituímos o texto "AIketing" pelo componente de Imagem */}
      <Link href="/">
        <Image
          src="/logo-aiketing.png" // O caminho é relativo à pasta 'public'
          alt="AIketing Logo"
          width={160} // Largura da imagem em pixels
          height={38} // Altura da imagem em pixels
          priority // Ajuda a carregar as imagens mais importantes (como o logo) mais rápido
        />
      </Link>
      <div className="flex items-center gap-6 md:gap-8">
        <LanguageSwitcher />
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/#pricing" className="text-gray-600 hover:text-brand-dark font-semibold hidden sm:block">
            {t('Header.Pricing')}
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-brand-dark font-semibold">
                {t('Header.Dashboard')}
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-brand-dark font-semibold">
                {t('Header.History')}
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 text-sm"
              >
                {t('Header.Logout')}
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:opacity-90 text-sm">
              {t('Header.Login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};